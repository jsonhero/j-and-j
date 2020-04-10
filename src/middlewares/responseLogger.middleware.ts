import { Request, Response } from 'express';

import { Context, NamedLogger } from '../utils';

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
  const snapshot = Context.snapshot;
  res.once('finish', () => {
    const endTime = Date.now();
    Context.setFromSnapshot(snapshot);
    logResponse(res, endTime - startTime);

    // We do this to clear up memory usage as Context is only removed by the garbage collector,
    //  which means it could use a lot of memory in times of high frequency
    Context.clearContext(snapshot.contextId);
  });
  return next();
}
