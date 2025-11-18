import serverless from 'serverless-http';
import { app } from '../src/app';
import { config } from '../src/config';
import { logger } from '../src/utils/common/logger';

try {
  app.listen(config.port, () => {
    logger.info('Starting');
    logger.info(`Server is running on port ${config.port}`);
    logger.info(`API is available at ${config.apiPrefix}`);
  });
} catch (error) {
  logger.error('Error starting server:', error);
  process.exit(1);
}

export default serverless(app);
