import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './validation.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Setup view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // Cookie
  app.use(cookieParser('some-cookie-secret'));

  // Setup the session storage
  app.use(session({
    secret: 'the-example-secret',
    saveUninitialized: false,
    resave: false
  }));


  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      validationError: {
        value: false,
        target: false
      },
      exceptionFactory(errors) {
          return new ValidationException(errors);
      },
    }));
  await app.listen(3000);
}
bootstrap();
