import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { getAccessToken, inserUser } from '../authentication';
import { CreditReserveOrder } from '../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { IsNull } from 'typeorm';
import { insertResetData } from './insert-data';

jest.setTimeout(1200000);
describe('order module', () => {
  let app: INestApplication;
  const password = 'admin@123';
  let token;
  const strQuery = `mutation resetOrder($inputResetOrder: InputResetOrder!){
    resetOrder(input: $inputResetOrder){
      message
      statusCode
      error{
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
    await app.init();
    await inserUser('test@gmail.com', password);
    token = await getAccessToken(app, { email: 'test@gmail.com', password });
    await insertResetData(true);
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('reset order', () => {
    it('TC_1: should be reset all status of step 1', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .send({
          query: strQuery,
          variables: {
            inputResetOrder: {
              orderDate: '2022-10-10',
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const { statusCode } = body.data.resetOrder;
          expect(statusCode).toEqual(HttpStatus.OK);
          const orders = await CreditReserveOrder.find({
            where: {
              nameMatchingResult: IsNull(),
              nisaResult: IsNull(),
              moneyShortageResult: IsNull(),
              ycustomerResult: IsNull(),
              branchlockResult: IsNull(),
              invalidCardCheckResult: IsNull(),
            },
          });
          expect(orders.length).toEqual(9);
        });
    });

    it('TC_2: should be return error when step before is done', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .send({
          query: strQuery,
          variables: {
            inputResetOrder: {
              orderDate: '2022-10-12',
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const { error } = body.data.resetOrder;
          expect(error.errorCode).toEqual('PROCESS_EXECUTION_DONE');
        });
    });

    it('TC_3: should be return error with invalid date', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .send({
          query: strQuery,
          variables: {
            inputResetOrder: {
              orderDate: 'aaa',
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const { error } = body.data.resetOrder;
          expect(error.errorCode).toEqual('INPUT_INVALID');
        });
    });

    it('TC_4 - Should be return error when token is invalid', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer token')
        .send({
          query: strQuery,
          variables: {
            inputResetOrder: {
              orderDate: '2022-10-10',
            },
          },
        })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.errors).toEqual(['Unauthorized']);
        });
    });
  });
});
