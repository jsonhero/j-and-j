import { Request, Response } from 'express';
export declare function requestLoggerMiddleware<T>(req: Request, res: Response, next: () => T): T;
