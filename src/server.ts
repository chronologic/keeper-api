import './env';
import { createConnection } from 'typeorm';

import app from './app';
import logger from './logger';

createConnection().then(() => {
  app.listen(app.get('port'), (): void => {
    logger.log('\x1b[36m%s\x1b[0m', `🌏 Express server started at http://localhost:${app.get('port')}`);
    if (process.env.NODE_ENV === 'development') {
      logger.log('\x1b[36m%s\x1b[0m', `⚙️  Swagger UI hosted at http://localhost:${app.get('port')}/dev/api-docs`);
    }
  });
});
