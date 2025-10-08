import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'apps/flipkart-backend/src/app.module';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(compression());
  app.use(cors());

  await app.listen(process.env.API_GATEWAY_PORT ?? 3000);
}
bootstrap();
