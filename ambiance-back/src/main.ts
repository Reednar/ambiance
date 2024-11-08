import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { logger } from './config/logger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: logger,
    });
    app.enableCors();
    app.setGlobalPrefix('api');
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
    await app.listen(process.env.PORT || 3000);
  } catch (error) {
    logger.error("Une erreur est survenue : " + error);
  }
}
bootstrap();
