import { INestApplication, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { App } from './modules';
import { namedLogger, globalLogger } from './utils';
import { ObjectionExceptionFilter } from './common/filters';

function nestJsLoggerWrapper(): LoggerService {
  return {
    log: (message, context) => globalLogger().info(context, message),
    error: (message, trace, context) => globalLogger().error(context, trace, message),
    warn: (message, context) => globalLogger().warn(context, message),
    debug: (message, context) => globalLogger().debug(context, message),
    verbose: (message, context) => globalLogger().trace(context, message),
  };
}

export async function bootstrap(): Promise<INestApplication | void> {
  const logger = namedLogger('Bootstrap');
  logger.info(
    `API enabled: Calling NestFactory create and app listen with port=${process.env.PORT}`,
  );

  const app = await NestFactory.create(App, {
    logger: nestJsLoggerWrapper(),
  });

  // TODO revisit this, this should allow req.ip to get ip from nginx proxy, probably should make this configurable
  //   Still need to test that is works as well (ensure incoming request logs have proper IP behind a proxy)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app as any).set('trust proxy', true);

  // TODO app.enableCors()

  app.useGlobalFilters(new ObjectionExceptionFilter());

  await app.listen(process.env.PORT);

  return app;
}

/*
TODO
 - Add a global exception filter for 500s that will tack on a trace id to the response for finding logs.
 */
