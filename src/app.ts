import log from './libs/winston';
import { appService } from './app/app.service';

appService.setEnvironment();

import expressInitializer from './libs/express';
import { mongoDbService } from './mongodb';

const appSettings = appService.getAppSettings();

(async () => {
  await expressInitializer().then(async () => {
    log.info(`App is running at ${appSettings.host}:${appSettings.port}`);
    await mongoDbService.connect();
  });
})().catch((error) => {
  console.log('error', error);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});
