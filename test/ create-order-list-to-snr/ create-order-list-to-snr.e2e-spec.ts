import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import connection from '../utils/connection';
import { LoggingInterceptor } from '../../src/vendors/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../src/vendors/filters/http-exception.filter';
import { CreditReserveOrder } from '../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { getAccessToken, inserUser } from '../../test/authentication';
import * as moment from 'moment';
import { CustomerOrderCloses } from '../../src/app/modules/customer-order-closes/entities/customer-order-closes.entity';
import { SnrFileFunds } from '../../src/app/modules/snrfile_funds/entities/snrfile_funds.entity';
import {
  DATA_CODE,
  UNIT_TYPE,
} from '../../src/configs/constants/error-code/snr-file-fund';

/**
 * Test case: https://docs.google.com/spreadsheets/d/1TG4iRKVIrtcHULdKMx6PtHtBJY9PpBwx/edit#gid=945285325
 */
jest.setTimeout(1200000);
describe('Credit Order List To SNR Function', () => {
  let app: INestApplication;
  let token: { accessToken: string; refreshToken: string };
  const mutation = `mutation createOrderListToSNR($dateOrder: Date!) {
    createOrderListToSNR(input: {
      orderDate: $dateOrder,
    }) {
      data {
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
    const email = 'michealden@gmail.com';
    const password = 'michealden';
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
  const path = '/graphql';
  describe('Check Logic', () => {
    it('TC1: Time < 11:45', async () => {
      const defaultTime = '2019-05-01';
      const defaultHour = '09:45:00';
      const orderDate = moment(defaultTime).toDate();
      const valueOf = moment(defaultTime + ' ' + defaultHour).valueOf();
      jest.spyOn(Date, 'now').mockImplementation(() => valueOf);

      const customerOrderCloses = new CustomerOrderCloses();
      customerOrderCloses.closedAt = new Date(defaultTime);
      customerOrderCloses.handlingOn = new Date(defaultTime);
      customerOrderCloses.serviceType = 30;
      await customerOrderCloses.save();

      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 70;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = new Date(defaultTime);
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '0';

      await creditReserveOrder.save();
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder: defaultTime } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const orderClose = await CustomerOrderCloses.findOne({
            where: {
              serviceType: 30,
              handlingOn: new Date(defaultTime),
            },
          });
          const creditOrder = await CreditReserveOrder.findOne({
            where: {
              orderDate,
            },
          });
          const snrFile = await SnrFileFunds.findOne({
            where: {
              creditReserveOrdersId: creditOrder.id,
              customerOrderCloseId: orderClose.id,
            },
          });
          expect(body.data.createOrderListToSNR.data).toEqual([
            {
              id: creditReserveOrder.id,
              creditReservesId: creditReserveOrder.creditReservesId,
              branchCode: creditReserveOrder.branchCode,
              accountCode: creditReserveOrder.accountCode,
              brandCode: creditReserveOrder.brandCode,
              orderAmount: creditReserveOrder.orderAmount,
              accountType: creditReserveOrder.accountType,
              orderDate: defaultTime,
              ycustomerResult: '0',
              branchlockResult: '0',
              moneyShortageResult: '0',
              nisaResult: '0',
              nameMatchingResult: '0',
              authSalesResult: '0',
              snrfileFundsId: snrFile.id,
              snrfileDepositsId: null,
            },
          ]);

          expect(snrFile.serviceType).toEqual(30);
          expect(snrFile.creditReserveOrdersId).toEqual(
            String(creditReserveOrder.id),
          );
          expect(snrFile.customerOrderCloseId).toEqual(String(orderClose.id));
          expect(snrFile.hulftNumber).toEqual(5);
          expect(snrFile.accountCode).toEqual(creditReserveOrder.accountCode);
          expect(snrFile.brandCode).toEqual(creditReserveOrder.brandCode);
          expect(snrFile.dataCode).toEqual(DATA_CODE);
          expect(snrFile.unitType).toEqual(UNIT_TYPE);
          expect(snrFile.contractedNumberSell).toEqual(
            creditReserveOrder.orderAmount,
          );
          expect(snrFile.settlementMethod).toEqual('1');
          expect(snrFile.commissionType).toEqual(
            creditReserveOrder.accountCode === '0' ? '' : '9',
          );
          expect(snrFile.specifiedAccountType).toEqual('7');
          expect(snrFile.identifyingCode).toEqual(
            String(
              snrFile.id.toString().length <= 8
                ? Number(snrFile.id.toString().slice(-8)) + 900000000
                : snrFile.id + 900000000,
            ),
          );
          expect(snrFile.orderReceiveDate).toEqual(
            moment(defaultTime).format('YYYYMMDD'),
          );
          expect(snrFile.orderReceiveTime).toEqual('1200');
          expect(snrFile.id).toEqual(creditOrder.snrfileFundsId);
        });
    });

    it('TC2: Time > 11:45', async () => {
      const defaultTime = '2019-05-02';
      const defaultHour = '12:00:00';
      const orderDate = moment(defaultTime).toDate();
      const valueOf = moment(defaultTime + ' ' + defaultHour).valueOf();
      jest.spyOn(Date, 'now').mockImplementation(() => valueOf);

      const customerOrderCloses = new CustomerOrderCloses();
      customerOrderCloses.closedAt = new Date(defaultTime);
      customerOrderCloses.handlingOn = new Date(defaultTime);
      customerOrderCloses.serviceType = 30;
      await customerOrderCloses.save();

      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 71;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = orderDate;
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '0';

      await creditReserveOrder.save();
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder: defaultTime } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const orderClose = await CustomerOrderCloses.findOne({
            where: {
              serviceType: 30,
              handlingOn: new Date(defaultTime),
            },
          });
          const creditOrder = await CreditReserveOrder.findOne({
            where: {
              orderDate,
            },
          });
          const snrFile = await SnrFileFunds.findOne({
            where: {
              creditReserveOrdersId: creditOrder.id,
              customerOrderCloseId: orderClose.id,
            },
          });
          expect(body.data.createOrderListToSNR.data).toEqual([
            {
              id: creditReserveOrder.id,
              creditReservesId: creditReserveOrder.creditReservesId,
              branchCode: creditReserveOrder.branchCode,
              accountCode: creditReserveOrder.accountCode,
              brandCode: creditReserveOrder.brandCode,
              orderAmount: creditReserveOrder.orderAmount,
              accountType: creditReserveOrder.accountType,
              orderDate: defaultTime,
              ycustomerResult: '0',
              branchlockResult: '0',
              moneyShortageResult: '0',
              nisaResult: '0',
              nameMatchingResult: '0',
              authSalesResult: '0',
              snrfileFundsId: snrFile.id,
              snrfileDepositsId: null,
            },
          ]);

          expect(snrFile.serviceType).toEqual(30);
          expect(snrFile.creditReserveOrdersId).toEqual(
            String(creditReserveOrder.id),
          );
          expect(snrFile.customerOrderCloseId).toEqual(String(orderClose.id));
          expect(snrFile.hulftNumber).toEqual(6);
          expect(snrFile.accountCode).toEqual(creditReserveOrder.accountCode);
          expect(snrFile.brandCode).toEqual(creditReserveOrder.brandCode);
          expect(snrFile.unitType).toEqual('2');
          expect(snrFile.contractedNumberSell).toEqual(
            creditReserveOrder.orderAmount,
          );
          expect(snrFile.settlementMethod).toEqual('1');
          expect(snrFile.commissionType).toEqual(
            creditReserveOrder.accountCode === '0' ? '' : '9',
          );
          expect(snrFile.specifiedAccountType).toEqual('7');
          expect(snrFile.identifyingCode).toEqual(
            String(
              snrFile.id.toString().length <= 8
                ? Number(snrFile.id.toString().slice(-8)) + 900000000
                : snrFile.id + 900000000,
            ),
          );
          expect(snrFile.orderReceiveDate).toEqual(
            moment(defaultTime).format('YYYYMMDD'),
          );
          expect(snrFile.orderReceiveTime).toEqual('1345');
          expect(snrFile.id).toEqual(creditOrder.snrfileFundsId);
        });
    });

    it('TC3: No target = 1', async () => {
      const defaultTime = '2019-05-03';
      const defaultHour = '12:00:00';
      const orderDate = moment(defaultTime).toDate();
      const valueOf = moment(defaultTime + ' ' + defaultHour).valueOf();
      jest.spyOn(Date, 'now').mockImplementation(() => valueOf);

      const customerOrderCloses = new CustomerOrderCloses();
      customerOrderCloses.closedAt = new Date(defaultTime);
      customerOrderCloses.handlingOn = new Date(defaultTime);
      customerOrderCloses.serviceType = 30;
      await customerOrderCloses.save();

      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 72;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = orderDate;
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '1';

      await creditReserveOrder.save();
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder: defaultTime } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const orderClose = await CustomerOrderCloses.findOne({
            where: {
              serviceType: 30,
              handlingOn: new Date(defaultTime),
            },
          });
          const creditOrder = await CreditReserveOrder.findOne({
            where: {
              orderDate,
            },
          });
          const snrFile = await SnrFileFunds.findOne({
            where: {
              creditReserveOrdersId: creditOrder.id,
              customerOrderCloseId: orderClose.id,
            },
          });
          expect(body.data.createOrderListToSNR.data).toEqual([]);
          expect(snrFile).toEqual(null);
          expect(creditOrder.snrfileFundsId).toEqual(null);
        });
    });

    it('TC4: AccoutType = 2', async () => {
      const defaultTime = '2019-05-04';
      const defaultHour = '12:00:00';
      const orderDate = moment(defaultTime).toDate();
      const valueOf = moment(defaultTime + ' ' + defaultHour).valueOf();
      jest.spyOn(Date, 'now').mockImplementation(() => valueOf);

      const customerOrderCloses = new CustomerOrderCloses();
      customerOrderCloses.closedAt = new Date(defaultTime);
      customerOrderCloses.handlingOn = new Date(defaultTime);
      customerOrderCloses.serviceType = 30;
      await customerOrderCloses.save();

      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 73;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 2;
      creditReserveOrder.orderDate = orderDate;
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '0';

      await creditReserveOrder.save();
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder: defaultTime } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const orderClose = await CustomerOrderCloses.findOne({
            where: {
              serviceType: 30,
              handlingOn: new Date(defaultTime),
            },
          });
          const creditOrder = await CreditReserveOrder.findOne({
            where: {
              orderDate,
            },
          });
          const snrFile = await SnrFileFunds.findOne({
            where: {
              creditReserveOrdersId: creditOrder.id,
              customerOrderCloseId: orderClose.id,
            },
          });
          expect(body.data.createOrderListToSNR.data).toEqual([
            {
              id: creditReserveOrder.id,
              creditReservesId: creditReserveOrder.creditReservesId,
              branchCode: creditReserveOrder.branchCode,
              accountCode: creditReserveOrder.accountCode,
              brandCode: creditReserveOrder.brandCode,
              orderAmount: creditReserveOrder.orderAmount,
              accountType: creditReserveOrder.accountType,
              orderDate: defaultTime,
              ycustomerResult: '0',
              branchlockResult: '0',
              moneyShortageResult: '0',
              nisaResult: '0',
              nameMatchingResult: '0',
              authSalesResult: '0',
              snrfileFundsId: snrFile.id,
              snrfileDepositsId: null,
            },
          ]);

          expect(snrFile.serviceType).toEqual(30);
          expect(snrFile.creditReserveOrdersId).toEqual(
            String(creditReserveOrder.id),
          );
          expect(snrFile.customerOrderCloseId).toEqual(String(orderClose.id));
          expect(snrFile.hulftNumber).toEqual(6);
          expect(snrFile.accountCode).toEqual(creditReserveOrder.accountCode);
          expect(snrFile.brandCode).toEqual(creditReserveOrder.brandCode);
          expect(snrFile.dataCode).toEqual(DATA_CODE);
          expect(snrFile.unitType).toEqual(UNIT_TYPE);
          expect(snrFile.contractedNumberSell).toEqual(
            creditReserveOrder.orderAmount,
          );
          expect(snrFile.settlementMethod).toEqual('1');
          expect(snrFile.commissionType).toEqual(
            creditReserveOrder.accountCode === '0' ? '' : '9',
          );
          expect(snrFile.specifiedAccountType).toEqual('7');
          expect(snrFile.identifyingCode).toEqual(
            String(
              snrFile.id.toString().length <= 8
                ? Number(snrFile.id.toString().slice(-8)) + 900000000
                : snrFile.id + 900000000,
            ),
          );
          expect(snrFile.orderReceiveDate).toEqual(
            moment(defaultTime).format('YYYYMMDD'),
          );
          expect(snrFile.orderReceiveTime).toEqual('1345');
          expect(snrFile.id).toEqual(creditOrder.snrfileFundsId);
        });
    });

    it('TC5: AccoutType = 0', async () => {
      const defaultTime = '2019-05-05';
      const defaultHour = '12:00:00';
      const orderDate = moment(defaultTime).toDate();
      const valueOf = moment(defaultTime + ' ' + defaultHour).valueOf();
      jest.spyOn(Date, 'now').mockImplementation(() => valueOf);

      const customerOrderCloses = new CustomerOrderCloses();
      customerOrderCloses.closedAt = new Date(defaultTime);
      customerOrderCloses.handlingOn = new Date(defaultTime);
      customerOrderCloses.serviceType = 30;
      await customerOrderCloses.save();

      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 74;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 0;
      creditReserveOrder.orderDate = orderDate;
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '0';

      await creditReserveOrder.save();
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder: defaultTime } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const orderClose = await CustomerOrderCloses.findOne({
            where: {
              serviceType: 30,
              handlingOn: new Date(defaultTime),
            },
          });
          const creditOrder = await CreditReserveOrder.findOne({
            where: {
              orderDate,
            },
          });
          const snrFile = await SnrFileFunds.findOne({
            where: {
              creditReserveOrdersId: creditOrder.id,
              customerOrderCloseId: orderClose.id,
            },
          });
          expect(body.data.createOrderListToSNR.data).toEqual([
            {
              id: creditReserveOrder.id,
              creditReservesId: creditReserveOrder.creditReservesId,
              branchCode: creditReserveOrder.branchCode,
              accountCode: creditReserveOrder.accountCode,
              brandCode: creditReserveOrder.brandCode,
              orderAmount: creditReserveOrder.orderAmount,
              accountType: creditReserveOrder.accountType,
              orderDate: defaultTime,
              ycustomerResult: '0',
              branchlockResult: '0',
              moneyShortageResult: '0',
              nisaResult: '0',
              nameMatchingResult: '0',
              authSalesResult: '0',
              snrfileFundsId: snrFile.id,
              snrfileDepositsId: null,
            },
          ]);

          expect(snrFile.serviceType).toEqual(30);
          expect(snrFile.creditReserveOrdersId).toEqual(
            String(creditReserveOrder.id),
          );
          expect(snrFile.customerOrderCloseId).toEqual(String(orderClose.id));
          expect(snrFile.hulftNumber).toEqual(6);
          expect(snrFile.accountCode).toEqual(creditReserveOrder.accountCode);
          expect(snrFile.brandCode).toEqual(creditReserveOrder.brandCode);
          expect(snrFile.dataCode).toEqual(DATA_CODE);
          expect(snrFile.unitType).toEqual(UNIT_TYPE);
          expect(snrFile.contractedNumberSell).toEqual(
            creditReserveOrder.orderAmount,
          );
          expect(snrFile.settlementMethod).toEqual('1');
          expect(snrFile.commissionType).toEqual(
            creditReserveOrder.accountCode === '0' ? '' : '9',
          );
          expect(snrFile.specifiedAccountType).toEqual('7');
          expect(snrFile.identifyingCode).toEqual(
            String(
              snrFile.id.toString().length <= 8
                ? Number(snrFile.id.toString().slice(-8)) + 900000000
                : snrFile.id + 900000000,
            ),
          );
          expect(snrFile.orderReceiveDate).toEqual(
            moment(defaultTime).format('YYYYMMDD'),
          );
          expect(snrFile.orderReceiveTime).toEqual('1345');
          expect(snrFile.id).toEqual(creditOrder.snrfileFundsId);
        });
    });

    it('TC6: CustomerOrderCloses is null', async () => {
      const defaultTime = '2019-05-06';
      const defaultHour = '12:00:00';
      const orderDate = moment(defaultTime).toDate();
      const valueOf = moment(defaultTime + ' ' + defaultHour).valueOf();
      jest.spyOn(Date, 'now').mockImplementation(() => valueOf);

      const creditReserveOrder = new CreditReserveOrder();
      creditReserveOrder.creditReservesId = 75;
      creditReserveOrder.branchCode = '1';
      creditReserveOrder.accountCode = 'A0001';
      creditReserveOrder.brandCode = '10009';
      creditReserveOrder.accountType = 0;
      creditReserveOrder.orderDate = orderDate;
      creditReserveOrder.orderAmount = 5000;
      creditReserveOrder.invalidCardCheckResult = '0';
      creditReserveOrder.branchlockResult = '0';
      creditReserveOrder.ycustomerResult = '0';
      creditReserveOrder.moneyShortageResult = '0';
      creditReserveOrder.nisaResult = '0';
      creditReserveOrder.nameMatchingResult = '0';
      creditReserveOrder.authSalesResult = '0';
      creditReserveOrder.notTarget = '0';

      await creditReserveOrder.save();
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { dateOrder: defaultTime } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          const orderClose = await CustomerOrderCloses.findOne({
            where: {
              serviceType: 30,
              handlingOn: new Date(defaultTime),
            },
          });
          expect(orderClose).toEqual(null);
          const creditOrder = await CreditReserveOrder.findOne({
            where: {
              orderDate,
            },
          });

          expect(body.data.createOrderListToSNR.data).toEqual(null);

          expect(creditOrder.snrfileFundsId).toEqual(null);
        });
    });
  });
});
