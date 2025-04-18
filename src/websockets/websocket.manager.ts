import * as fs from 'fs';
import https from 'https';
import { WebsocketServerLib } from '../libs/websocket-server.lib';

import { appService } from '../app/app.service';

class WebsocketManager {
  private clientIds: string[] = [];
  private connection: WebsocketServerLib;

  constructor() {
    const { websocketsPort } = appService.getAppSettings();

    /*
    const server = https.createServer({
      cert: fs.readFileSync(
        '/etc/letsencrypt/live/instagram-helper.fun/fullchain.pem',
        'utf-8',
      ),

      key: fs.readFileSync(
        '/etc/letsencrypt/live/instagram-helper.fun/privkey.pem',
        'utf-8',
      ),
    });
    */

    this.connection = new WebsocketServerLib({
      port: websocketsPort,
      // server,
    });

    // server.listen(websocketsPort);
    this.connection.onConnection(this.onUserConnected.bind(this));
  }

  sendMessageToClient(clientId: string, message: string) {
    if (!this.clientIds.includes(clientId)) {
      console.log('No clientId in list');
      return false;
    }

    this.connection.sendMessageToClients([clientId], message);
    return true;
  }

  private onUserConnected(clientId: string) {
    this.clientIds.push(clientId);

    this.connection.onError(clientId, this.onError.bind(this));
    this.connection.onClose(clientId, this.onClose.bind(this));
    // this.connection.onMessage(clientId, this.onMessage.bind(this));

    this.sendMessageToClient(
      clientId,
      JSON.stringify({
        event: 'INIT',
        data: clientId,
      }),
    );
  }

  private onError(clientId: string, err: Error) {
    console.log('onError', clientId, err);
  }

  private onClose(clientId: string) {
    this.clientIds = this.clientIds.filter((id) => id !== clientId);
  }
}

export const websocketManager = new WebsocketManager();
