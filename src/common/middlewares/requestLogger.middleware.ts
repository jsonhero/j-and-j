import { IncomingHttpHeaders } from 'http';

import { Request, Response } from 'express';

import { NamedLogger } from '../utils';

const logger: NamedLogger = new NamedLogger('Request');

function filterHeaders(headers: IncomingHttpHeaders): IncomingHttpHeaders {
  const filteredHeaders = {};
  Object.entries(headers).forEach(([header, value]) => {
    if (header.includes('trace') || header.includes('transaction')) {
      filteredHeaders[header] = value;
    }
  });
  return filteredHeaders;
}

export function requestLoggerMiddleware<T>(
  req: Request,
  res: Response,
  next: () => T,
): T {
  const { method, url, ip, headers } = req;
  logger.info({ method, url, ip }, filterHeaders(headers));
  return next();
}
