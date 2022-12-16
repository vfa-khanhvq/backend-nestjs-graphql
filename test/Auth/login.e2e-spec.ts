import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { inserUser } from '../authentication';

jest.setTimeout(1200000);
describe('Auth module', () => {
  let app: INestApplication;
  const password = 'admin@123';
  const strQuery = `
  query login($email: String!, $password: String!, $grantType: String) {
    login(input: { email: $email, password: $password,grantType: $grantType  }) {
      statusCode
      data {
        tokenType
        accessToken {
          accessToken
          expiredAt
        }
        refreshToken {
          refreshToken
          expiredAt
        }
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
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('login', () => {
    it('TC1: Should be login success', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: 'test@gmail.com', password },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toHaveProperty('accessToken');
          expect(data.accessToken).toHaveProperty('accessToken');
          expect(data).toHaveProperty('refreshToken');
          expect(data.refreshToken).toHaveProperty('refreshToken');
        });
    });

    it('TC2: Should be return error when email is not existed', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: 'test1@gmail.com', password },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('EMAIL_NOT_FOUND');
        });
    });

    it('TC3: Should be return error when password is not correct', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: 'test@gmail.com', password: 'abcABC12!@' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('WRONG_PASSWORD');
        });
    });

    it('TC4: Should be return error when email is empty', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: '', password: 'abcABC12!@' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });

    it('TC5: Should be return error when email is missing', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({ query: strQuery, variables: { password: 'abcABC12!@' } })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('TC6: Should be return error when password is empty', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: 'test@gmail.com', password: '' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });

    it('TC7: Should be return error when password is missing', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({ query: strQuery, variables: { email: 'test@gmail.com' } })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('TC6: Should be return error when password is have 2 charactoe', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: 'test@gmail.com', password: '11' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });

    it('TC9: Should be return sucess when params is correct', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: {
            email: 'test@gmail.com',
            password,
            grantType: 'password',
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toBeTruthy();
        });
    });

    it('TC10: Should be return sucess when params is correct without grant type', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: { email: 'test@gmail.com', password },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toBeTruthy();
        });
    });

    it('TC11: Should be return error when grant type incorrect', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: {
            email: 'test@gmail.com',
            password,
            grantType: 'grantType',
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode } = body.data.login;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('TC12: Should be return error when prams just grant type', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({ query: strQuery, variables: { grantType: 'grantType' } })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
