import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { getAccessToken, inserUser } from '../authentication';
import { PaymentInfo } from '../../src/app/modules/gmo/entities/payment_info.entity';
import { CreditReserveOrder } from '../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { CreditCardInfo } from '../../src/app/modules/inactive-card/entities/credit_card_info.entity';
import * as moment from 'moment';
import { join } from 'path';

import { graphqlUploadExpress } from 'graphql-upload';

jest.setTimeout(1200000);
describe('GMO module', () => {
  let app: INestApplication;
  const password = 'admin@123';
  let token: { accessToken: string; refreshToken: string };
  const strQuery = `
  mutation updateGmoData($file: FileUpload!, $orderDate: Date!) {
    updateGmoData(gmoData: { file: $file, orderDate: $orderDate }) {
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
    app.use(graphqlUploadExpress());
    await app.init();
    await inserUser('test@gmail.com', password);
    token = await getAccessToken(app, { email: 'test@gmail.com', password });
    for (const i of ['303', '304']) {
      const pay = new PaymentInfo();
      pay.accountCode = '100001';
      pay.branchCode = i;
      pay.memberId = 'M' + i;
      pay.cardSeq = 'Seq';
      await pay.save();
    }
    let countCard = 0;
    for (const i of ['303', '304']) {
      countCard++;
      const card = new CreditCardInfo();
      card.accountCode = '100001';
      card.branchCode = i;
      card.firmCode = 'F' + countCard;
      card.cNo = countCard;
      card.expiration = moment().add(1, 'y').toDate();
      card.invalidFlg = false;
      await card.save();
    }
    let count = 0;
    for (const i of ['303', '303', '304']) {
      const order = new CreditReserveOrder();
      order.accountCode = '100001';
      order.branchCode = i;
      order.brandCode = i;
      order.orderAmount = +i;
      order.orderDate = new Date('2022-10-10 00:00:00');
      order.creditReservesId = ++count;
      order.accountType = 0;
      order.invalidCardCheckResult = '0';
      order.ycustomerResult = '0';
      order.branchlockResult = '0';
      order.moneyShortageResult = '0';
      order.nisaResult = '0';
      order.nameMatchingResult = '0';
      await order.save();
    }
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('update GMO data', () => {
    it('TC_1: Should be get update order from gmo data success', async () => {
      const fixturePath = join(__dirname, './file-csv/TC01.csv');
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: strQuery,
            variables: {
              file: null,
              orderDate: '2022-10-10',
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            0: ['variables.file'],
          }),
        )
        .attach('0', fixturePath)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(body);
          const { statusCode } = body.data.updateGmoData;
          expect(statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('TC_2: Should be get update order from gmo data success with nomal error', async () => {
      const fixturePath = join(__dirname, './file-csv/TC02.csv');
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: strQuery,
            variables: {
              file: null,
              orderDate: '2022-10-10',
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            0: ['variables.file'],
          }),
        )
        .attach('0', fixturePath)
        .expect(({ body }) => {
          const { statusCode } = body.data.updateGmoData;
          expect(statusCode).toEqual(HttpStatus.OK);
        });
    });

    it('TC_3: Should be get update order and card info from gmo data success with card error', async () => {
      const fixturePath = join(__dirname, './file-csv/TC03.csv');
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: strQuery,
            variables: {
              file: null,
              orderDate: '2022-10-10',
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            0: ['variables.file'],
          }),
        )
        .attach('0', fixturePath)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const { statusCode } = body.data.updateGmoData;
          expect(statusCode).toEqual(HttpStatus.OK);
          const validCards = await CreditCardInfo.find({
            where: { invalidFlg: false },
          });
          expect(validCards.length).toEqual(1);
        });
    });

    it('TC_4: Should be return error when token incorrect', async () => {
      const fixturePath = join(__dirname, './file-csv/TC01.csv');
      await request(app.getHttpServer())
        .post(path)
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: strQuery,
            variables: {
              file: null,
              orderDate: '2022-10-10',
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            0: ['variables.file'],
          }),
        )
        .attach('0', fixturePath)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.errors).toEqual(['Unauthorized']);
        });
    });

    it('TC_5: Should be return value with incorrect date', async () => {
      const fixturePath = join(__dirname, './file-csv/TC01.csv');
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: strQuery,
            variables: {
              file: null,
              orderDate: 'abc',
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            0: ['variables.file'],
          }),
        )
        .attach('0', fixturePath)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode } = body.data.updateGmoData;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('TC_6: Should be return value with incorrect params', async () => {
      const fixturePath = join(__dirname, './file-csv/TC01.csv');
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .set('Content-Type', 'multipart/form-data')
        .field(
          'operations',
          JSON.stringify({
            query: strQuery,
            variables: {
              file: null,
            },
          }),
        )
        .field(
          'map',
          JSON.stringify({
            0: ['variables.file'],
          }),
        )
        .attach('0', fixturePath)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
