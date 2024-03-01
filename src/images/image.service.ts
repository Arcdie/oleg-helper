import { AxiosLib } from '../libs/axios.lib';

class ImageService {
  async fetchImage(imageLink: string) {
    try {
      const responseData = await AxiosLib.makeGetRequest<ArrayBuffer>(
        imageLink,
        {},
        {
          responseType: 'arraybuffer',
        },
      );

      return responseData.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export const imageService = new ImageService();
