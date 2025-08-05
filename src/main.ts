import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {env}  from './env';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Minha API')
  .setDescription('Documentação da API com Swagger')
  .setVersion('1.0')
  .addTag('produtores') 
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(env.PORT);
}
bootstrap();
