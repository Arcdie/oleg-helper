import { AxiosLib } from '../libs/axios.lib';
import { arrayBufferToBlob } from 'blob-util';

import { appService } from '../app/app.service';

import { IMAGE_URL, UPLOAD_URL } from './cloudflare.constants';

import { IUploadImageResponse } from './interfaces/upload-image.interface';

class CloudflareService {
  async uploadImage(imageName: string, imageBuffer: ArrayBuffer) {
    try {
      const { token, accountId } = appService.getCloudflareSettings();

      const uploadUrl = this.getUploadUrl(accountId);

      const formData = new FormData();
      formData.append(
        'file',
        arrayBufferToBlob(imageBuffer, 'image/jpeg'),
        imageName,
      );

      const result = await AxiosLib.makePostRequest<IUploadImageResponse>(
        uploadUrl,
        formData,
        {
          headers: this.getRequestHeaders(token),
        },
      );

      if (!result.data.success) {
        console.log('Cant upload image to cloudflare', result.data);
        return false;
      }

      return result.data.result.id;
    } catch (err: any) {
      console.log(err.response.data);
      return false;
    }
  }

  private getRequestHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
  }

  getImageUrl(imageId: string) {
    const { accountHash } = appService.getCloudflareSettings();

    return IMAGE_URL.replace('$imageId', imageId).replace(
      '$accountHash',
      accountHash,
    );
  }

  private getUploadUrl(accountId: string) {
    return UPLOAD_URL.replace('$accountId', accountId);
  }
}

export const cloudflareService = new CloudflareService();
