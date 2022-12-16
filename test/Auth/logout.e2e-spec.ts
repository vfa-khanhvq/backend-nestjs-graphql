import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { getAccessToken, inserUser } from '../authentication';

jest.setTimeout(1200000);
describe('Auth module', () => {
  let app: INestApplication;
  const password = 'admin@123';
  let token;
  const strQuery = `query logout{
    logout{
      statusCode
      data {
        userId
      }
      error {
        message
      }
    }
  }`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await inserUser('test@gmail.com', password);
    await app.init();
    token = await getAccessToken(app, { email: 'test@gmail.com', password });
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('logout', () => {
    it('TC1: Should be logout success', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .send({
          query: strQuery,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.logout;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toHaveProperty('userId');
        });
    });

    it('TC2: Should be return error when token is invalid', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer token')
        .send({
          query: strQuery,
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { errors } = body;
          expect(errors).toContain('Unauthorized');
        });
    });
  });
});
