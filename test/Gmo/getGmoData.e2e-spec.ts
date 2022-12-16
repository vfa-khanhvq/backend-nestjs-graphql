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

jest.setTimeout(1200000);
describe('GMO module', () => {
  let app: INestApplication;
  const password = 'admin@123';
  let token;
  const strQuery = `query getGmoData($input: InputCreditOrder!){
    getGmoData(input: $input){
      statusCode
      message
      data{
          shopId
          orderId,
          processingDivision,
          amount,
          paymentMethod,
          memberId
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
    let count = 0;
    for (const i of ['303', '303', '304']) {
      const order = new CreditReserveOrder();
      order.accountCode = '100001';
      order.branchCode = i;
      order.brandCode = i;
      order.orderAmount = +i;
      order.orderDate = new Date('2022-10-10');
      order.creditReservesId = ++count;
      order.accountType = 0;
      order.invalidCardCheckResult = '0';
      order.ycustomerResult = '0';
      order.branchlockResult = '0';
      order.moneyShortageResult = '0';
      order.nisaResult = '0';
      order.nameMatchingResult = '0';
      order.notTarget = '0';
      await order.save();
    }
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const path = '/graphql';
  describe('Get GMO data', () => {
    it('TC_1: Should be get GMO data success', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .send({
          query: strQuery,
          variables: {
            input: {
              orderDate: '2022-10-10',
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode, data } = body.data.getGmoData;
          expect(statusCode).toEqual(HttpStatus.OK);
          expect(data.length).toEqual(2);
          expect(data[0].amount).toEqual(606);
          expect(data[1].amount).toEqual(304);
        });
    });

    it('TC_2: Should be return error when date incorrect format', async () => {
      await request(app.getHttpServer())
        .post(path)
        .set('authorization', 'bearer ' + token.accessToken)
        .send({
          query: strQuery,
          variables: {
            input: {
              orderDate: 'a',
            },
          },
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const { statusCode } = body.data.getGmoData;
          expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
        });
    });

    it('TC_3: Should be return error when token incorrect', async () => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          query: strQuery,
          variables: {
            input: {
              orderDate: '2022-10-10',
            },
          },
        })
        .set('authorization', 'bearer ')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.errors).toEqual(['Unauthorized']);
        });
    });
  });
});
