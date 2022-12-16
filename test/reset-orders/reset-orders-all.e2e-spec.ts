import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { getAccessToken, inserSuperAdmin, inserUser } from '../authentication';
import { CreditReserveOrder } from '../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { IsNull } from 'typeorm';
import { insertResetData } from './insert-data';
import { SnrFileFunds } from '../../src/app/modules/snrfile_funds/entities/snrfile_funds.entity';
import { SnrfileDeposits } from '../../src/app/modules/snrfile-deposits/entities/snrfile-deposits.entity';

jest.setTimeout(1200000);
describe('order module', () => {
  let app: INestApplication;
  const password = 'admin@123';
  let token;
  let tokenSuperAdmin;
  const strQuery = `mutation resetOrderAll($inputResetOrder: InputResetOrder!){
    resetOrderAll(input: $inputResetOrder){
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
    await inserSuperAdmin('admin@gmail.com', password);
    token = await getAccessToken(app, { email: 'test@gmail.com', password });
    tokenSuperAdmin = await getAccessToken(app, {
      email: 'admin@gmail.com',
      password,
    });
    await insertResetData();
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('reset order all', () => {
    it('TC_1: should be reset all order status and set hulft number of snr file to 99999', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + tokenSuperAdmin.accessToken)
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
          const { statusCode } = body.data.resetOrderAll;
          expect(statusCode).toEqual(HttpStatus.OK);
          const orders = await CreditReserveOrder.find({
            where: {
              snrfileDepositsId: IsNull(),
              snrfileFundsId: IsNull(),
              authSalesResult: IsNull(),
              nameMatchingResult: IsNull(),
              nisaResult: IsNull(),
              moneyShortageResult: IsNull(),
              ycustomerResult: IsNull(),
              branchlockResult: IsNull(),
              invalidCardCheckResult: IsNull(),
              orderDate: new Date('2022-10-10 00:00:00'),
            },
          });
          const snrfileDeposits = await SnrfileDeposits.find({
            where: {
              hulftNumber: 99999,
            },
          });
          const snrFileFunds = await SnrFileFunds.find({
            where: {
              hulftNumber: 99999,
            },
          });
          expect(orders.length).toEqual(9);
          expect(snrfileDeposits.length).toEqual(9);
          expect(snrFileFunds.length).toEqual(9);
        });
    });

    it('TC_2: should be return error with invalid date', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + tokenSuperAdmin.accessToken)
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
          const { statusCode } = body.data.resetOrderAll;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('TC3 - Should be return error when token is invalid', async () => {
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

    it('TC4 - Should be return error when token have no permission', async () => {
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
        .then(({ body }) => {
          expect(body.errors).toEqual(['Forbidden']);
        });
    });
  });
});
