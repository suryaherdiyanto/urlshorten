import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, ValidationPipe, HttpStatus, ValidationError } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { join } from 'path';
import * as Tokens from 'csrf';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let csrfToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
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


    app.useGlobalPipes(new ValidationPipe({ whitelist: true, validationError: { value: false }, exceptionFactory: (errors: ValidationError[]) => {
      const validationErrors = errors.map((error) => { return { field: error.property, errorMessages: Object.values(error.constraints) } });

      return new HttpException({ message: 'Invalid input', validationErrors }, HttpStatus.BAD_REQUEST);
    } }));
    const token = new Tokens();
    const secret = token.secretSync();

    csrfToken = token.create(secret)+'.'+secret;
      await app.init();
    });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });
});
