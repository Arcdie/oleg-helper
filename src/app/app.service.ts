import path from 'path';
import dotenv from 'dotenv';

class AppService {
  setEnvironment() {
    const envPath = path.join(__dirname, '../../.env');
    dotenv.config({ path: envPath });
  }

  getEnvironment() {
    return this.getConfig().app.environment;
  }

  getAppSettings() {
    return this.getConfig().app;
  }

  getInstagramSettings() {
    return this.getConfig().instagram;
  }

  private getConfig() {
    return {
      app: {
        host: 'localhost',
        url: process.env.APP_URL,
        environment: process.env.NODE_ENV,
        port: Number(process.env.APP_PORT),
        websocketsPort: Number(process.env.WEBSOCKETS_PORT),
      },

      instagram: {
        docId: String(process.env.INSTAGRAM_DOC_ID),
        lsdToken: String(process.env.INSTAGRAM_LSD_TOKEN),
      },
    };
  }
}

export const appService = new AppService();
