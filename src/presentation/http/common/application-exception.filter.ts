import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  BookingNotFoundError,
  OverlappingBookingError,
  NotOwnerError,
  BookingCancelledError,
} from '../../../application/errors/booking.errors';

function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return 'Unknown error';
  }
}

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Pass through HttpExceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        code: status,
        message: getMessage(exception),
      });
    }

    // Map application errors to HTTP
    if (exception instanceof BookingNotFoundError) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ code: 404, message: getMessage(exception) });
    }
    if (exception instanceof OverlappingBookingError) {
      return response
        .status(HttpStatus.CONFLICT)
        .json({ code: 409, message: getMessage(exception) });
    }
    if (exception instanceof NotOwnerError) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .json({ code: 403, message: getMessage(exception) });
    }
    if (exception instanceof BookingCancelledError) {
      return response
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ code: 422, message: getMessage(exception) });
    }
    if (
      exception instanceof Error &&
      exception.message === 'InvalidTimeRange'
    ) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ code: 400, message: 'Invalid time range' });
    }

    // Fallback
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return response.status(status).json({
      code: status,
      message: 'Internal server error',
    });
  }
}
