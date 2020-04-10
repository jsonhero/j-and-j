import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError, ValidationError } from 'objection';
export declare class ObjectionExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationError | NotFoundError, host: ArgumentsHost): Response;
}
