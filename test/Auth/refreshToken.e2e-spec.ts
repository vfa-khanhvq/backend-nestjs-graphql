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
  const strQuery = `query refreshToken($refreshToken: String!)
  {
      refreshToken (
           refreshToken: $refreshToken
      ),
      {
        statusCode
        data {
          accessToken
          expiredAt
        }
        error {
          errorCode
          message
          details{
            message
            key
            type
            value
          }
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
  describe('refresh token', () => {
    it('TC1: Should be get new access token success', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { refreshToken: token.refreshToken },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.refreshToken;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toHaveProperty('accessToken');
        });
    });

    it('TC_2: Should be return error when refresh token is empty', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({ query: strQuery, variables: { refreshToken: '' } })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode } = body.data.refreshToken;
          expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });

    it('TC_3: Should be return error when refresh token is missing', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({ query: strQuery, variables: {} })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('TC_4: Should be return error when refresh token is incorect', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({ query: strQuery, variables: { refreshToken: 'abcasc_asdasd' } })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode } = body.data.refreshToken;
          expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });
  });
});
