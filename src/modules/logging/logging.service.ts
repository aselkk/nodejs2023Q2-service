import { Injectable, Logger, Inject } from '@nestjs/common';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

@Injectable()
export class LoggingService {
  private logger = new Logger('CustomLogger');

  log(level: LogLevel, message: string) {
    switch (level) {
      case LogLevel.ERROR:
        this.logger.error(message);
        break;
      case LogLevel.WARN:
        this.logger.warn(message);
        break;
      case LogLevel.INFO:
        this.logger.log(message);
        break;
      case LogLevel.DEBUG:
        this.logger.debug(message);
        break;
      default:
        this.logger.log(message);
    }
  }

  error(message: string, trace?: string) {
    this.log(LogLevel.ERROR, message);
    if (trace) {
      this.logger.error(trace);
    }
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }
}
