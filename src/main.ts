import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('api');
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
