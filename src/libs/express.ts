import path from 'path';
import { Server } from 'http';
import bodyParser from 'body-parser';
import express, { Express, ErrorRequestHandler } from 'express';

import routes from '../routes';
import morgan from '../middlewares/morgan.middleware';

import { getEnv } from './helper';
import { appService } from '../app/app.service';

const appSettings = appService.getAppSettings();

const initExpress = () => express();

const useRoutes = (expressApp: Express) => {
  expressApp.use('/', routes);
  return expressApp;
};

const useMiddlewares = (expressApp: Express) => {
  const frontFolder = path.join(__dirname, '../../frontend');

  expressApp.set('views', `${frontFolder}/views`);
  expressApp.set('view engine', 'pug');

  expressApp.use(bodyParser.json({}));
  expressApp.use(bodyParser.urlencoded({ extended: false }));

  expressApp.use(express.static(`${frontFolder}/public`));

  if (!['production', 'test'].includes(getEnv())) {
    expressApp.use(morgan);
  }

  return expressApp;
};

const useErrorsHandling = (expressApp: Express) => {
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  };

  expressApp.use((req, res) => res.sendStatus(404));
  expressApp.use(errorHandler);

  return expressApp;
};

const listen = (expressApp: Express): Promise<Server> =>
  new Promise((res) => {
    const server = expressApp.listen(appSettings.port, appSettings.host, () =>
      res(server),
    );
  });

const init = () => {
  const expressApp = initExpress();
  useMiddlewares(expressApp);
  useRoutes(expressApp);
  useErrorsHandling(expressApp);

  return listen(expressApp);
};

export default init;
