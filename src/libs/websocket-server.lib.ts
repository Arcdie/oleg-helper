import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'https';
import WebSocket, { WebSocketServer } from 'ws';

export class WebsocketServerLib {
  private connection: WebSocketServer;
  private clientsMapper = new Map<string, WebSocket>();

  constructor(settings: {
    port?: number;
    server?: ReturnType<typeof createServer>;
  }) {
    this.connection = new WebSocketServer(settings);
  }

  onConnection(callback: (clientId: string, url?: string) => void) {
    this.connection.on('connection', (ws, req) => {
      const clientId = uuidv4();
      this.clientsMapper.set(clientId, ws);
      callback(clientId, req.url);
    });
  }

  onMessage(
    clientId: string,
    callback: (clientId: string, data: string) => void,
  ) {
    const connection = this.clientsMapper.get(clientId);

    if (!connection) {
      return;
    }

    connection.on('message', (bufferData) =>
      callback(clientId, bufferData.toString()),
    );
  }

  onError(clientId: string, callback: (clientId: string, err: Error) => void) {
    const connection = this.clientsMapper.get(clientId);

    if (!connection) {
      return;
    }

    connection.on('error', (err) => callback(clientId, err));
  }

  onClose(clientId: string, callback: (clientId: string) => void) {
    const connection = this.clientsMapper.get(clientId);

    if (!connection) {
      return;
    }

    connection.on('close', () => {
      this.clientsMapper.delete(clientId);
      callback(clientId);
    });
  }

  sendMessageToClients(clientIds: string[], message: string) {
    clientIds.forEach((clientId) => {
      const connection = this.clientsMapper.get(clientId);

      if (!connection) {
        return;
      }

      connection.send(message);
    });
  }

  sendMessagToAllClients(message: string) {
    this.connection.clients.forEach((client) => {
      client.send(message);
    });
  }

  terminateClient(clientId: string) {
    const connection = this.clientsMapper.get(clientId);
    connection && connection.terminate();
  }
}
