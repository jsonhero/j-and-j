import { Request, Response } from 'express';

import { NamedLogger } from '../../utils';

const logger: NamedLogger = new NamedLogger('Response');

function logResponse(res: Response, time: number): void {
  const logInfo = {
    time,
    statusCode: res.statusCode,
  };

  logger.info('Response in', logInfo);
}

export function responseLoggerMiddleware<T>(
  req: Request,
  res: Response,
  next: () => T,
): T {
  const startTime = Date.now();
  // We have to snapshot to put it into the context of the finish callback, which is
  //  run outside the async execution of the request handlers.
  res.once('finish', () => {
    const endTime = Date.now();
    logResponse(res, endTime - startTime);
  });
  return next();
}
