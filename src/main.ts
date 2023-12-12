// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './modules/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);

  process.on('uncaughtException', (error) => {
    loggingService.error('Uncaught Exception', error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason:any) => {
    loggingService.error('Unhandled Rejection', reason);
    process.exit(1);
  });

  await app.listen(80);
}
bootstrap();
