import axios from 'axios';

import { getQueue, getUniqueId } from '../libs/helpers';

import { appService } from '../app/app.service';
import { imageService } from '../images/image.service';
import { chatGPTService } from '../chatgpt/chatgpt.service';
import { websocketManager } from '../websockets/websocket.manager';
import { cloudflareService } from '../cloudflare/cloudflare.service';

import { POSTS_PER_REQUEST } from './instagram.constants';

import { IGood } from '../goods/interfaces/good.interface';
import { IGetPostsResponse } from './interfaces/get-posts.response';

class InstagramService {
  private parseUrl = 'https://www.instagram.com/api/graphql';

  async uploadImage(imageLink: string) {
    const buffer = await imageService.fetchImage(imageLink);

    if (!buffer) {
      return false;
    }

    await cloudflareService.uploadImage('image.jpg', buffer);

    return true;
  }

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
    if (!data.goods.length || data.isError) {
      websocketManager.sendMessageToClient(
        clientId,
        JSON.stringify({ event: 'GOODS', data }),
      );

      return;
    }

    const imageLinkIdMapper = new Map<string, string>();

    const queue = getQueue(data.goods, 10);

    for await (const e of queue) {
      await Promise.all(
        e.map(async (good) => {
          if (!good.text) {
            return;
          }

          await Promise.all(
            good.images.map(async (imageLink) => {
              const imageName = `${getUniqueId()}.jpg`;

              const buffer = await imageService.fetchImage(imageLink);

              if (!buffer) {
                return null;
              }

              const resultUpload = await cloudflareService.uploadImage(
                imageName,
                buffer,
              );

              if (!resultUpload) {
                return null;
              }

              imageLinkIdMapper.set(imageLink, resultUpload);
            }),
          );

          good.images = good.images.map((e) => {
            const value = imageLinkIdMapper.get(e);
            return value ? cloudflareService.getImageUrl(value) : '';
          });

          try {
            good.data = await chatGPTService.sendMessage(good.text);
          } catch (err) {
            console.log('Error happened while sending message to chatgpt', err);
          }

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
