import OpenAI from 'openai';
import * as path from 'path';

import { readFileSync } from '../libs/fs';

import { appService } from '../app/app.service';
import { IShopGood } from '../shop-goods/shop-goods.model';
// import { IShopGood } from '../shop-goods/interfaces/shop-good.interface';

class ChatGPTService {
  private openai: OpenAI;
  private prompt: string;

  constructor() {
    const { apikey } = appService.getChatGPTSettings();

    // this.prompt = readFileSync(path.resolve(__dirname, './prompt.txt'));
    this.prompt =
      'Разделить текст на категории: заголовок, описание, цена и атрибуты. Не редактируй текст. Пиши ответ в формате `{заголовок}|{описание}|{цена}|{атрибуты}`. Если категории нет, пиши @';

    this.openai = new OpenAI({
      apiKey: apikey,
    });
  }

  async sendMessage(message: string) {
    return undefined;

    /*
    const response = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: this.prompt },
        { role: 'user', content: message },
      ],
      model: 'gpt-4-turbo',
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log({
      messages: [
        { role: 'system', content: this.prompt },
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (
      response &&
      response.choices.length &&
      response.choices[0].message.content
    ) {
      return this.parseMessage(response.choices[0].message.content);
    }

    return undefined;
    */
  }

  private parseMessage(content: string) {
    const [title, description, price, attributes] = content.split('|');

    return {
      title: title !== '@' ? title : '',
      pretty_description: description !== '@' ? description : '',
      price: price !== '@' ? price : '',
      attributes: attributes !== '@' ? attributes : '',
    };
  }
}

export const chatGPTService = new ChatGPTService();
