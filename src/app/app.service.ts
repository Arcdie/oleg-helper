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

  getCloudflareSettings() {
    return this.getConfig().cloudflare;
  }

  getInstagramSettings() {
    return this.getConfig().instagram;
  }

  getChatGPTSettings() {
    return this.getConfig().chatgpt;
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

      cloudflare: {
        token: String(process.env.CLOUDFLARE_TOKEN),
        accountId: String(process.env.CLOUDFLARE_ACCOUNT_ID),
        accountHash: String(process.env.CLOUDFLARE_ACCOUNT_HASH),
      },

      chatgpt: {
        apikey: String(process.env.CHATGPT_APIKEY),
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
    };
  }
}

export const appService = new AppService();
