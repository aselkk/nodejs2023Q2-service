import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Inject } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(@Inject('LoggingService') private readonly loggingService: LoggingService) {}

  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    this.loggingService.error(error.message, error.stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}
