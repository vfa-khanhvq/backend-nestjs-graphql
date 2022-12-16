import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import * as bcrypt from 'bcrypt';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { User } from '../../src/app/modules/auth/entities/user.entity';

jest.setTimeout(1200000);
describe('Auth module', () => {
  let app: INestApplication;

  const mutation = `
  mutation addUser($email: String!, $password: String!) {
    addUser(
    input: { email: $email, password: $password }
  ) {
    data
    error {
      errorCode
      message
      details {
        key
        type
        value
        message
      }
    }
    statusCode
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
    await app.init();
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('Add new user', () => {
    it('TC1: Add new user success', async () => {
      const password = 'admin@123';
      await request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 'test@gmail.com', password },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.addUser;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data).toEqual('success!');
        });
      const adminDb = await User.findOne({
        where: { email: 'test@gmail.com' },
      });
      const isMatchPassword = bcrypt.compareSync(password, adminDb.password);
      expect(isMatchPassword).toEqual(true);
    });

    it('TC2: Throw error when email invalid', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 'test@gmail', password: 'admin@123' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, error } = body.data.addUser;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(error.errorCode).toEqual('INPUT_INVALID');
          expect(error.message).toEqual('"email" must be a valid email');
        });
    });

    it('TC3: Throw error when email is incorrect type', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 2, password: 'admin@123' },
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.errors).toEqual([
            'Variable "$email" got invalid value 2; String cannot represent a non string value: 2',
          ]);
        });
    });

    it('TC4: Throw error when password is incorrect type', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 'test@gmail.com', password: 1 },
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.errors).toEqual([
            'Variable "$password" got invalid value 1; String cannot represent a non string value: 1',
          ]);
        });
    });

    it('TC5: Throw error when password is less than 6 character', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 'test@gmail.com', password: '123' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, error } = body.data.addUser;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(error.errorCode).toEqual('INPUT_INVALID');
          expect(error.message).toEqual(
            '"password" length must be at least 6 characters long',
          );
        });
    });

    it('TC6: Throw error when user is already exists', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 'test@gmail.com', password: 'admin@123' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, error } = body.data.addUser;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(error.errorCode).toEqual('EMAIL_ALREADY_IN_USE');
          expect(error.message).toEqual('email already in use');
        });
    });

    it('TC7: Throw error when password is wrong format', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({
          query: mutation,
          variables: { email: 'test@gmail.com', password: 'admin123' },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, error } = body.data.addUser;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(error.errorCode).toEqual('INPUT_INVALID');
          expect(error.message).toEqual('Wrong password format');
        });
    });

    it('TC8: Throw error when email is null', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({ query: mutation, variables: { password: 'admin123' } })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.errors).toEqual([
            'Variable "$email" of required type "String!" was not provided.',
          ]);
        });
    });

    it('TC9: Throw error when password is null', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({ query: mutation, variables: { email: 'test@gmail.com' } })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.errors).toEqual([
            'Variable "$password" of required type "String!" was not provided.',
          ]);
        });
    });

    it('TC10: Throw error when email and password is null', () => {
      return request(app.getHttpServer())
        .post(path)
        .set('key', 'admin_secret_key')
        .send({ query: mutation })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.errors).toEqual([
            'Variable "$email" of required type "String!" was not provided.',
            'Variable "$password" of required type "String!" was not provided.',
          ]);
        });
    });
  });
});
