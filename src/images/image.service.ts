import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

class ImageService {
  async saveImage(imageLink: string, imageName: string) {
    const buffer = await this.downloadImage(imageLink);
    const pathToFolder = path.join(
      __dirname,
      '../../frontend/public/files/goods',
    );

    return new Promise<boolean>((res, rej) => {
      buffer
        .pipe(fs.createWriteStream(`${pathToFolder}/${imageName}`))
        .on('finish', () => res(true))
        .on('error', (e: any) => rej(e));
    });
  }

  private async downloadImage(imageLink: string) {
    const response = await axios({
      url: imageLink,
      responseType: 'stream',
    });

    return response.data;
  }
}

export const imageService = new ImageService();
