import mongoose from 'mongoose';

import log from './libs/winston';
import { appService } from './app/app.service';

class MongodbService {
  async connect() {
    const { host, port, database } = appService.getMongodbSettings();

    try {
      const connection = await mongoose.connect(
        `mongodb://${host}:${port}/${database}`,
        {
          connectTimeoutMS: 30000,
        },
      );

      mongoose.Promise = global.Promise;

      log.info('Conenction to MongoDB is successful');
    } catch (err) {
      log.error('MongoDB connection error', err);
    }
  }
}

export const mongoDbService = new MongodbService();
