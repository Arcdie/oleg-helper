import axios from 'axios';

import { sleep } from '../libs/helper';
import { appService } from '../app/app.service';
import { imageService } from '../images/image.service';
import { websocketManager } from '../websockets/websocket.manager';

import { POSTS_PER_REQUEST } from './instagram.constants';

import { IGood } from '../goods/interfaces/good.interface';
import { IGetPostsResponse } from './interfaces/get-posts.response';

class InstagramService {
  private parseUrl = 'https://www.instagram.com/api/graphql';

  async initGettingsGods(pageCode: string, clientId: string) {
    return this.getNextPageWithGoods(pageCode, clientId, 0);
  }

  getPageCode(instagramLink: string) {
    const pageCode = instagramLink.split('instagram.com')[1];
    return pageCode.replace(/\//g, '');
  }

  private async sendGoods(
    clientId: string,
    data: {
      goods: IGood[];
      isError: boolean;
      isFinished: boolean;
    },
  ) {
    const appSettings = appService.getAppSettings();

    if (!data.goods.length || data.isError) {
      websocketManager.sendMessageToClient(
        clientId,
        JSON.stringify({ event: 'GOODS', data }),
      );

      return;
    }

    for await (const good of data.goods) {
      let index = 0;

      for await (const imageLink of good.images) {
        await imageService.saveImage(imageLink, `${good.link}-${index}.jpg`);
        index += 1;
      }

      good.images = good.images.map(
        (e, i) => `${appSettings.url}/files/goods/${good.link}-${i}.jpg`,
      );

      websocketManager.sendMessageToClient(
        clientId,
        JSON.stringify({
          event: 'GOODS',
          data: {
            goods: [good],
            isError: false,
            isFinished: false,
          },
        }),
      );
    }

    if (data.isFinished) {
      websocketManager.sendMessageToClient(
        clientId,
        JSON.stringify({
          event: 'GOODS',
          data: {
            goods: [],
            isFinished: true,
            isError: data.isError,
          },
        }),
      );
    }
  }

  private async getNextPageWithGoods(
    pageCode: string,
    clientId: string,
    page = 0,
    after = '',
  ): Promise<boolean> {
    try {
      const { docId, lsdToken } = appService.getInstagramSettings();

      const variables =
        page === 0
          ? { data: { count: POSTS_PER_REQUEST }, username: pageCode }
          : {
              after: after,
              before: null,
              data: { count: POSTS_PER_REQUEST },
              first: POSTS_PER_REQUEST,
              last: null,
              username: pageCode,
            };

      const response = await axios<IGetPostsResponse>(this.parseUrl, {
        method: 'POST',
        headers: { 'x-fb-lsd': lsdToken },
        data: `lsd=${lsdToken}&doc_id=${docId}&variables=${encodeURIComponent(
          JSON.stringify(variables),
        )}`,
      });

      if (
        !response.data ||
        !response.data.data ||
        !response.data.data.xdt_api__v1__feed__user_timeline_graphql_connection
      ) {
        console.log('error', response.data);

        const result = {
          isFinished: true,
          isError: true,
          goods: [],
        };

        this.sendGoods(clientId, result);
        return false;
      }

      const data =
        response.data.data.xdt_api__v1__feed__user_timeline_graphql_connection;
      const pageInfo = data.page_info;

      const newPosts = data.edges.map((e) => {
        const images = [];

        if (e.node.carousel_media) {
          e.node.carousel_media.forEach((m) => {
            images.push(m.image_versions2.candidates[0].url);
          });
        } else {
          images.push(e.node.image_versions2.candidates[0].url);
        }

        return {
          link: e.node.code,
          text: e.node.caption?.text || '',
          images,
        };
      });

      if (!pageInfo.has_next_page) {
        const result = {
          isFinished: true,
          isError: false,
          goods: newPosts,
        };

        this.sendGoods(clientId, result);
        return true;
      }

      const result = {
        isFinished: false,
        isError: false,
        goods: newPosts,
      };

      await this.sendGoods(clientId, result);
      await sleep(1000);

      return this.getNextPageWithGoods(
        pageCode,
        clientId,
        page + 1,
        pageInfo.end_cursor,
      );
    } catch (error) {
      console.log('error', error);

      const result = {
        isFinished: true,
        isError: true,
        goods: [],
      };

      this.sendGoods(clientId, result);
      return false;
    }
  }
}

export const instagramService = new InstagramService();
