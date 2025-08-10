import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Agro Management API')
    .setDescription('API para gerenciamento de produtores rurais, fazendas, safras e culturas plantadas')
    .setVersion('1.0')
    .addTag('produtores', 'Operações relacionadas aos produtores rurais')
    .addTag('fazendas', 'Operações relacionadas às fazendas')
    .addTag('safras', 'Operações relacionadas às safras')
    .addTag('culturas-plantadas', 'Operações relacionadas às culturas plantadas')
    .addTag('users', 'Operações relacionadas aos usuários do sistema')
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
