import { Request, Response } from 'express';
export declare function responseLoggerMiddleware<T>(req: Request, res: Response, next: () => T): T;
