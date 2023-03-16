import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function connectServer() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('URL Shortner')
    .setDescription('API Documemtation With Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const PORT = 5000;
  await app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
connectServer();
