import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import timeout from 'connect-timeout';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

import { config } from './config';
import { errorHandler, notFoundHandler, rateLimiter } from './middlewares';
import { logger } from './utils/common/logger';
import { ResponseHandler } from './utils/response/responseHandler';
import userRouter from './modules/users/routes';

const app = express();
const allowedOrigins = config.corsOrigin.split(',').map(origin => origin.trim());

app.use(rateLimiter);
app.use(timeout('10s'));
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();
router.use(`/users`, userRouter);
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.timeout && req.timedout) {
    return ResponseHandler.error(res, {
      message: 'Request timed out',
      statusCode: 503,
    });
  }
  next(err);
});

export { app };
