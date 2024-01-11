import axios from 'axios';

import { sleep } from '../libs/helper';
import { appService } from '../app/app.service';

import { POSTS_PER_REQUEST } from './instagram.constants';

import { IGood } from '../goods/interfaces/good.interface';
import { IGetPostsResponse } from './interfaces/get-posts.response';

class InstagramService {
  private parseUrl = 'https://www.instagram.com/api/graphql';

  async getGoods(pageCode: string) {
    return this.getNextPageWithGoods(pageCode, 0);
  }

  getPageCode(instagramLink: string) {
    const pageCode = instagramLink.split('instagram.com')[1];
    return pageCode.replace(/\//g, '');
  }

  private async getNextPageWithGoods(
    pageCode: string,
    page = 0,
    after = '',
    goods: IGood[] = [],
  ): Promise<{
    isFinished: boolean;
    goods: IGood[];
  }> {
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

      goods.push(...newPosts);

      if (!pageInfo.has_next_page) {
        return { isFinished: true, goods };
      }

      await sleep(1000);

      return this.getNextPageWithGoods(
        pageCode,
        page + 1,
        pageInfo.end_cursor,
        goods,
      );
    } catch (error) {
      console.log('error', error);
      return { isFinished: false, goods };
    }
  }
}

export const instagramService = new InstagramService();
