import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DevLogger } from './loggers/dev.logger';
import { TskvLogger } from './loggers/Tskv.logger';
import { JsonLogger } from './loggers/json.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  if (process.env.NODE_ENV === 'development') {
    app.useLogger(new DevLogger());
  } else if (
    process.env.NODE_ENV === 'production' &&
    process.env.LOGGER === 'tskv'
  ) {
    app.useLogger(new TskvLogger());
  } else {
    app.useLogger(new JsonLogger());
  }
  await app.listen(3000);
}
bootstrap();
