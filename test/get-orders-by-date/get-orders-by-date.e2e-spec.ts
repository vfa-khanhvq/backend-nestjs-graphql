import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { CreditReserveOrder } from '../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { getAccessToken, inserUser } from '../authentication';
import { CreditProcessStep } from '../../src/app/modules/credit-process-steps/entities/credit-process-steps.entity';

/**
 * Test case: https://docs.google.com/spreadsheets/d/1f6ro29p5Rdam2DB1FKr1alQsU_VphVF-/edit?usp=sharing&ouid=117747707644312189784&rtpof=true&sd=true
 */
jest.setTimeout(1200000);
describe('get order module', () => {
  let app: INestApplication;
  let token: { accessToken: string; refreshToken: string };

  const mutation = `
  query getOrdersByDate($dateOrder: Date!, $page: Int, $pageSize: Int) {
    getOrdersByDate(input: { orderDate: $dateOrder, page: $page, pageSize: $pageSize }) {
      data {
        step
        items {
          id
          creditReservesId
          branchCode
          accountCode
          brandCode
          orderAmount
          accountType
          orderDate
          ycustomerResult
          branchlockResult
          moneyShortageResult
          nisaResult
          nameMatchingResult
          authSalesResult
          snrfileFundsId
          snrfileDepositsId
          invalidCardCheckResult
        }
        pagination {
          pageSize
          pageTotal
          currentPage
          pageSize
          totalCount
        }
      }
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
    const email = 'tobibui@gmail.com';
    const password = 'tobibui';
    await inserUser(email, password);
    token = await getAccessToken(app, {
      email,
      password,
      grantType: 'password',
    });
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });
  const page = 1;
  const pageSize = 1000;
  const path = '/graphql';
  describe('Check Logic', () => {
    it('TC1: check response data step 1', async () => {
      const dateOrder = '2020-01-11';
      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 30;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = new Date(dateOrder);
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.notTarget = '0';
      await creditReserveOrder.save();

      const creditProcessStep = new CreditProcessStep();
      creditProcessStep.currentStep = 1;
      creditProcessStep.status = 'DONE';
      creditProcessStep.orderDate = new Date(dateOrder);
      await creditProcessStep.save();

      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder, page, pageSize } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.getOrdersByDate.data.items.length).toEqual(1);
          expect(body.data.getOrdersByDate.data.step).toEqual(1);
          expect(body.data.getOrdersByDate.error).toEqual(null);
          expect(body.data.getOrdersByDate.statusCode).toEqual(200);
          expect(body.data.getOrdersByDate.data.pagination).toEqual({
            pageSize,
            pageTotal: 1,
            currentPage: page,
            totalCount: 1,
          });
        });
    });

    it('TC2: check response data step 3', async () => {
      const dateOrder = '2020-01-12';
      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 31;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = new Date(dateOrder);
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '0';
      await creditReserveOrder.save();

      const creditProcessStep = new CreditProcessStep();
      creditProcessStep.currentStep = 3;
      creditProcessStep.status = 'DONE';
      creditProcessStep.orderDate = new Date(dateOrder);
      await creditProcessStep.save();

      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder, page, pageSize } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.getOrdersByDate.data.items.length).toEqual(1);
          expect(body.data.getOrdersByDate.data.step).toEqual(3);
          expect(body.data.getOrdersByDate.error).toEqual(null);
          expect(body.data.getOrdersByDate.statusCode).toEqual(200);
          expect(body.data.getOrdersByDate.data.pagination).toEqual({
            pageSize,
            pageTotal: 1,
            currentPage: page,
            totalCount: 1,
          });
        });
    });

    it('TC3: check response data step 4', async () => {
      const dateOrder = '2019-01-13';
      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 32;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = new Date(dateOrder);
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.snrfileFundsId = 1;
      creditReserveOrder.notTarget = '0';

      await creditReserveOrder.save();

      const creditProcessStep = new CreditProcessStep();
      creditProcessStep.currentStep = 4;
      creditProcessStep.status = 'DONE';
      creditProcessStep.orderDate = new Date(dateOrder);
      await creditProcessStep.save();

      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder, page, pageSize } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.getOrdersByDate.data.items.length).toEqual(1);
          expect(body.data.getOrdersByDate.data.step).toEqual(4);
          expect(body.data.getOrdersByDate.error).toEqual(null);
          expect(body.data.getOrdersByDate.statusCode).toEqual(200);
          expect(body.data.getOrdersByDate.data.pagination).toEqual({
            pageSize,
            pageTotal: 1,
            currentPage: page,
            totalCount: 1,
          });
        });
    });

    it('TC4: check response data step 5', async () => {
      const dateOrder = '2019-01-14';
      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 33;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = new Date(dateOrder);
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.snrfileFundsId = 2;
      creditReserveOrder.snrfileDepositsId = 2;
      creditReserveOrder.notTarget = '0';

      const creditProcessStep = new CreditProcessStep();
      creditProcessStep.currentStep = 5;
      creditProcessStep.status = 'DONE';
      creditProcessStep.orderDate = new Date(dateOrder);
      await creditProcessStep.save();

      await creditReserveOrder.save();

      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder, page, pageSize } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.getOrdersByDate.data.items.length).toEqual(1);
          expect(body.data.getOrdersByDate.data.step).toEqual(5);
          expect(body.data.getOrdersByDate.error).toEqual(null);
          expect(body.data.getOrdersByDate.statusCode).toEqual(200);
          expect(body.data.getOrdersByDate.data.pagination).toEqual({
            pageSize,
            pageTotal: 1,
            currentPage: page,
            totalCount: 1,
          });
        });
    });
  });
  describe('Check input', () => {
    it('TC5: dateOrder invalid', async () => {
      const dateOrder = '2021-99-99';
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          expect(body.data.getOrdersByDate.error).toEqual({
            errorCode: 'INPUT_INVALID',
            message: '"orderDate" must be a valid date',
            details: [
              {
                key: 'orderDate',
                type: 'date.base',
                value: dateOrder,
                message: '"orderDate" must be a valid date',
              },
            ],
          });
          expect(body.data.getOrdersByDate.statusCode).toEqual(400);
        });
    });

    it('TC6: dateOrder valid', async () => {
      const dateOrder = '2021-10-10';
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          expect(body.data.getOrdersByDate.error).toEqual(null);
        });
    });

    it('TC7: pagesize, page invalid', async () => {
      const dateOrder = '2021-10-10';
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder, page: -1 } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          expect(body.data.getOrdersByDate.error).toEqual({
            errorCode: 'INPUT_INVALID',
            message: '"page" must be greater than or equal to 1',
            details: [
              {
                key: 'page',
                message: '"page" must be greater than or equal to 1',
                type: 'number.min',
                value: '-1',
              },
            ],
          });
        });
    });
  });
});
