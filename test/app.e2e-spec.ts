import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, ValidationPipe, HttpStatus, ValidationError } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { join } from 'path';
import * as Tokens from 'csrf';
import { Repository } from 'typeorm';
import { Redirect } from '../src/redirects/entities/redirects.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let csrfToken: string;
  let redirectRepository: Repository<Redirect>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    redirectRepository = moduleFixture.get(getRepositoryToken(Redirect));
    await redirectRepository.createQueryBuilder().insert().into(Redirect).values([{ referrer: 'qweRTy', full_url: 'https://www.facebook.com/john.doe', hit_counts: 5}]).execute();

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
  it('/check-hits (POST): should return 400 response code when the csrf token are not provided', () => {
    return request(app.getHttpServer())
            .post('/check-hits')
            .field('url', 'http://localhost:3000/abcd')
            .expect(400);
  });
  it('/check-hits (POST): should return 404 response code when the the referrer path format are not valid', () => {
    return request(app.getHttpServer())
            .post('/check-hits')
            .send('url=http://localhost:3000/abcd&_csrf='+csrfToken)
            .expect(404);
  });
  it('/check-hits (POST): should return 404 response code when the the referrer are not found in the database', () => {
    return request(app.getHttpServer())
            .post('/check-hits')
            .send('url=http://localhost:3000/s/abcd&_csrf='+csrfToken)
            .expect(404);
  });
  it('/check-hits (POST): should the correct hit count', () => {
    return request(app.getHttpServer())
            .post('/check-hits')
            .send('url=http://localhost:3000/s/qweRTy&_csrf='+csrfToken)
            .expect(200)
            .then((response) => {
              expect(response.body.data.hit_counts).toEqual(5);
            });
  });
});
