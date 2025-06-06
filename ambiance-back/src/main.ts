import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/logger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config(); // en tout début

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  // Permet d'utiliser les cookies (nécessaire pour auth via cookie)
  app.use(cookieParser());

  //taille body max
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  // Configuration CORS pour accepter les cookies côté frontend
  app.enableCors({
    //origin: 'http://localhost:4200',
    origin: process.env.FRONTEND_URL,
    credentials: true, // Très important pour que les cookies soient envoyés
  });
 app.useWebSocketAdapter(new IoAdapter(app));
  // Préfixe global pour les routes
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addCookieAuth('access_token') // Ajoute ça si tu veux voir les cookies dans Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Lancement de l'application
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
