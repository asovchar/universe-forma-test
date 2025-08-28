import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();

  const configService = app.get(ConfigService);

  const host = configService.get<string>('host')!;
  const port = configService.get<number>('port')!;

  await app.listen(port, host);
}

bootstrap();
