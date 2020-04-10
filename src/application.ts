import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { App } from './modules';
import { NamedLogger } from './utils';
import { ObjectionExceptionFilter } from './filters';
import {
  requestLoggerMiddleware,
  responseLoggerMiddleware,
} from './middlewares';

export async function bootstrap(): Promise<INestApplication | void> {
  const logger = new NamedLogger('Bootstrap');
  logger.info(
    `API enabled: Calling NestFactory create and app listen with port=${process.env.PORT}`,
  );

  const app = await NestFactory.create(App, {
    logger: new NamedLogger('NestJS').asNestLoggerService(),
  });

  // TODO revisit this, this should allow req.ip to get ip from nginx proxy, probably should make this configurable
  //   Still need to test that is works as well (ensure incoming request logs have proper IP behind a proxy)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app as any).set('trust proxy', true);

  // TODO app.enableCors()

  app.use(requestLoggerMiddleware);
  app.useGlobalFilters(new ObjectionExceptionFilter());
  app.use(responseLoggerMiddleware);

  await app.listen(process.env.PORT);

  return app;
}

/*
TODO
 - Add a global exception filter for 500s that will tack on a trace id to the response for finding logs.
 */
