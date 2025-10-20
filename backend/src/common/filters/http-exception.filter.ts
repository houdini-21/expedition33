import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/* The HttpExceptionFilter class in TypeScript is used to catch and handle HTTP exceptions by
formatting the response with specific information. */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const payload = exception.getResponse() as {
      message?: string | string[];
      error?: string;
    };

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      message: Array.isArray(payload?.message)
        ? payload.message.join(', ')
        : (payload?.message ?? exception.message),
    });
  }
}
