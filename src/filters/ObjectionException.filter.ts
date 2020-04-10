import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError, ValidationError } from 'objection';

@Catch(ValidationError, NotFoundError)
export class ObjectionExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError | NotFoundError, host: ArgumentsHost): Response {
    return host.switchToHttp().getResponse<Response>().status(exception.statusCode).json(exception);
  }
}
