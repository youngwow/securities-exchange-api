import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {IoAdapter} from "@nestjs/platform-socket.io";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  // app.enableCors({
  //   'credentials': true,
  //   'origin': true,
  //   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   'allowedHeaders': 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept'
  // });
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(4000);
}
bootstrap();
