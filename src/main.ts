import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: '*', // Permite todas las solicitudes de origen (puedes restringir esto según sea necesario)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
  app.enableCors(corsOptions);
  
  // Usar IoAdapter para WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));

  //swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API descriptionn')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/explorer', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`API is running on: http://localhost:${port}`);
  console.log(`Swagger is available at: http://localhost:${port}/api/explorer`);
}
bootstrap();
