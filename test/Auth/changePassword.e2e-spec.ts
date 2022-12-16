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
  const newPassword = 'admin@1234';
  let token;
  const strQuery = `mutation changePassword($changePassword: ChangePasswordInput){
    changePassword(changePassword: $changePassword){
      statusCode
      message
      data{
        userId
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
    token = token.accessToken;
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('Change password', () => {
    it('TC1: Should be change password success', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token)
        .send({
          query: strQuery,
          variables: {
            changePassword: {
              password,
              newPassword,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.changePassword;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toHaveProperty('userId');
        });
    });

    it('TC2: Should be return error when old pass is not correct', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token)
        .send({
          query: strQuery,
          variables: {
            changePassword: {
              password: 'admin@123aa',
              newPassword,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.changePassword;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('WRONG_PASSWORD');
        });
    });

    it('TC3: Should be return error when old password is not correct format', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token)
        .send({
          query: strQuery,
          variables: {
            changePassword: {
              password: 'admin',
              newPassword,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.changePassword;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });

    it('TC6: Should be return error when old password is empty', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token)
        .send({
          query: strQuery,
          variables: {
            changePassword: {
              password: '',
              newPassword,
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.changePassword;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });

    it('TC7: Should be return error when new password is empty', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token)
        .send({
          query: strQuery,
          variables: {
            changePassword: {
              password,
              newPassword: '',
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data, error } = body.data.changePassword;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(data).toEqual(null);
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });
  });
});
