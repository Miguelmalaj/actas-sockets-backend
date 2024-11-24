import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as cors from 'cors';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {

  // HTTPS options with SSL certificates
  const httpsOptions = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
  };

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

  // Get ports and host from .env or defaults
  const httpPort = process.env.HTTP_PORT || 3000;
  const httpsPort = process.env.HTTPS_PORT || 3443;
  const host = process.env.IP || '127.0.0.1';

  // Create HTTP server
  const httpServer = http.createServer((req, res) => {
    // Redirect HTTP to HTTPS
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  });

  // Create HTTPS server
  const httpsServer = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());

  // Start HTTP server
  httpServer.listen(httpPort, () => {
    console.log(`HTTP is running on: http://localhost:${httpPort}`);
    console.log('Redirecting HTTP traffic to HTTPS');
  });

  // Start HTTPS server
  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS is running on: https://localhost:${httpsPort}`);
    console.log(`Swagger is available at: https://localhost:${httpsPort}/api/explorer`);
  });

  // await app.listen(port);

  /* console.log(`API is running on: http://localhost:${port}`);
  console.log(`Swagger is available at: http://localhost:${port}/api/explorer`); */
}
bootstrap();
