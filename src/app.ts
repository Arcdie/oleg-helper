import log from './libs/winston';
import { appService } from './app/app.service';

appService.setEnvironment();

import migrations from './migrations';
import expressInitializer from './libs/express';

const appSettings = appService.getAppSettings();

(async () => {
  await expressInitializer().then(() =>
    log.info(`App is running at ${appSettings.host}:${appSettings.port}`),
  );

  // await migrations();
})().catch((error) => {
  console.log('error', error);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});
