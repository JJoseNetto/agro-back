import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {env}  from './env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(env.PORT);
}
bootstrap();
