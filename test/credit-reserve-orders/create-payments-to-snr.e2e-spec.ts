import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import connection from '../../test/utils/connection';
import { CreditReserveOrder } from './../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { FundMst } from './../../src/app/modules/fund_mst/entities/fund_mst.entity';
import { Holidays } from './../../src/app/modules/holidays/entities/holidays.entity';
import { CustomerOrderCloses } from './../../src/app/modules/customer-order-closes/entities/customer-order-closes.entity';
import { getAccessToken, inserUser } from '../authentication';
import { SnrfileDeposits } from './../../src/app/modules/snrfile-deposits/entities/snrfile-deposits.entity';

jest.setTimeout(120000);
describe('create payments', () => {
  let app: INestApplication;

  const path = '/graphql';
  const query = `query createPaymentsToSnr($orderDate: Date) {
    createPaymentsToSnr(orderDate: $orderDate) {
      statusCode
      data {
        id
        creditReservesId
        branchCode
        accountCode
        brandCode
        orderAmount
        invalidCardCheckResult
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
        notTarget
      }
      message
    }
  }`;
  let token: { accessToken: string; refreshToken: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    await createCreditReservesOrders();
    await createFundMsts();
    await createHolidays();
    await createCustomerOrderCloses();

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

  // Test data base on the link below
  // https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
  // Test data have 3 day -> just test 3 day
  describe('Should be run correctly', () => {
    it('Should be run correctly day 5', async () => {
      const orderDate = '2022-10-05';
      await request(app.getHttpServer())
        .post(path)
        .send({ query, variables: { orderDate } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const { statusCode } = body.data.createPaymentsToSnr;
          expect(statusCode).toEqual(HttpStatus.OK);
        });
      await expectationResults();
    });
    it('Should be run correctly day 7', async () => {
      const orderDate = '2022-10-07';
      await request(app.getHttpServer())
        .post(path)
        .send({ query, variables: { orderDate } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const { statusCode } = body.data.createPaymentsToSnr;
          expect(statusCode).toEqual(HttpStatus.OK);
        });
      await expectationResults();
    });
    it('Should be run correctly day 10', async () => {
      const orderDate = '2022-10-10';
      await request(app.getHttpServer())
        .post(path)
        .send({ query, variables: { orderDate } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const { statusCode } = body.data.createPaymentsToSnr;
          expect(statusCode).toEqual(HttpStatus.OK);
        });
      await expectationResults();
    });
  });
});

/**
 * create CreditReservesOrders base on link data below
 * https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
 */
async function createCreditReservesOrders() {
  const creditReservesOrders = [];
  let creditReservesId = 1;
  const creditReservesOrder1 = new CreditReserveOrder();
  creditReservesOrder1.branchCode = '303';
  creditReservesOrder1.accountCode = '100001';
  creditReservesOrder1.brandCode = '1000';
  creditReservesOrder1.orderAmount = 10000;
  creditReservesOrder1.accountType = 0;
  creditReservesOrder1.creditReservesId = ++creditReservesId;
  creditReservesOrder1.orderDate = new Date('2022-10-05');
  creditReservesOrder1.invalidCardCheckResult = '0';
  creditReservesOrder1.branchlockResult = '0';
  creditReservesOrder1.ycustomerResult = '0';
  creditReservesOrder1.moneyShortageResult = '0';
  creditReservesOrder1.nisaResult = '0';
  creditReservesOrder1.nameMatchingResult = '0';
  creditReservesOrder1.authSalesResult = '0';
  creditReservesOrder1.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder1);

  const creditReservesOrder2 = new CreditReserveOrder();
  creditReservesOrder2.branchCode = '303';
  creditReservesOrder2.accountCode = '100001';
  creditReservesOrder2.brandCode = '1001';
  creditReservesOrder2.orderAmount = 2000;
  creditReservesOrder2.accountType = 2;
  creditReservesOrder2.creditReservesId = ++creditReservesId;
  creditReservesOrder2.orderDate = new Date('2022-10-07');
  creditReservesOrder2.invalidCardCheckResult = '0';
  creditReservesOrder2.branchlockResult = '0';
  creditReservesOrder2.ycustomerResult = '0';
  creditReservesOrder2.moneyShortageResult = '0';
  creditReservesOrder2.nisaResult = '0';
  creditReservesOrder2.nameMatchingResult = '0';
  creditReservesOrder2.authSalesResult = '0';
  creditReservesOrder2.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder2);

  const creditReservesOrder3 = new CreditReserveOrder();
  creditReservesOrder3.branchCode = '303';
  creditReservesOrder3.accountCode = '100001';
  creditReservesOrder3.brandCode = '1002';
  creditReservesOrder3.orderAmount = 2000;
  creditReservesOrder3.accountType = 2;
  creditReservesOrder3.creditReservesId = ++creditReservesId;
  creditReservesOrder3.orderDate = new Date('2022-10-10');
  creditReservesOrder3.invalidCardCheckResult = '0';
  creditReservesOrder3.branchlockResult = '0';
  creditReservesOrder3.ycustomerResult = '0';
  creditReservesOrder3.moneyShortageResult = '0';
  creditReservesOrder3.nisaResult = '0';
  creditReservesOrder3.nameMatchingResult = '0';
  creditReservesOrder3.authSalesResult = '0';
  creditReservesOrder3.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder3);

  const creditReservesOrder4 = new CreditReserveOrder();
  creditReservesOrder4.branchCode = '304';
  creditReservesOrder4.accountCode = '100002';
  creditReservesOrder4.brandCode = '1003';
  creditReservesOrder4.orderAmount = 1000;
  creditReservesOrder4.accountType = 2;
  creditReservesOrder4.creditReservesId = ++creditReservesId;
  creditReservesOrder4.orderDate = new Date('2022-10-05');
  creditReservesOrder4.invalidCardCheckResult = '0';
  creditReservesOrder4.branchlockResult = '0';
  creditReservesOrder4.ycustomerResult = '0';
  creditReservesOrder4.moneyShortageResult = '0';
  creditReservesOrder4.nisaResult = '0';
  creditReservesOrder4.nameMatchingResult = '0';
  creditReservesOrder4.authSalesResult = '0';
  creditReservesOrder4.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder4);

  const creditReservesOrder5 = new CreditReserveOrder();
  creditReservesOrder5.branchCode = '304';
  creditReservesOrder5.accountCode = '100002';
  creditReservesOrder5.brandCode = '1004';
  creditReservesOrder5.orderAmount = 20000;
  creditReservesOrder5.accountType = 0;
  creditReservesOrder5.creditReservesId = ++creditReservesId;
  creditReservesOrder5.orderDate = new Date('2022-10-05');
  creditReservesOrder5.invalidCardCheckResult = '0';
  creditReservesOrder5.branchlockResult = '0';
  creditReservesOrder5.ycustomerResult = '0';
  creditReservesOrder5.moneyShortageResult = '0';
  creditReservesOrder5.nisaResult = '0';
  creditReservesOrder5.nameMatchingResult = '0';
  creditReservesOrder5.authSalesResult = '0';
  creditReservesOrder5.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder5);

  const creditReservesOrder6 = new CreditReserveOrder();
  creditReservesOrder6.branchCode = '304';
  creditReservesOrder6.accountCode = '100002';
  creditReservesOrder6.brandCode = '1005';
  creditReservesOrder6.orderAmount = 10000;
  creditReservesOrder6.accountType = 0;
  creditReservesOrder6.creditReservesId = ++creditReservesId;
  creditReservesOrder6.orderDate = new Date('2022-10-10');
  creditReservesOrder6.invalidCardCheckResult = '0';
  creditReservesOrder6.branchlockResult = '0';
  creditReservesOrder6.ycustomerResult = '0';
  creditReservesOrder6.moneyShortageResult = '0';
  creditReservesOrder6.nisaResult = '0';
  creditReservesOrder6.nameMatchingResult = '0';
  creditReservesOrder6.authSalesResult = '0';
  creditReservesOrder6.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder6);

  const creditReservesOrder7 = new CreditReserveOrder();
  creditReservesOrder7.branchCode = '305';
  creditReservesOrder7.accountCode = '100003';
  creditReservesOrder7.brandCode = '1006';
  creditReservesOrder7.orderAmount = 1000;
  creditReservesOrder7.accountType = 2;
  creditReservesOrder7.creditReservesId = ++creditReservesId;
  creditReservesOrder7.orderDate = new Date('2022-10-07');
  creditReservesOrder7.invalidCardCheckResult = '0';
  creditReservesOrder7.branchlockResult = '0';
  creditReservesOrder7.ycustomerResult = '0';
  creditReservesOrder7.moneyShortageResult = '0';
  creditReservesOrder7.nisaResult = '0';
  creditReservesOrder7.nameMatchingResult = '0';
  creditReservesOrder7.authSalesResult = '0';
  creditReservesOrder7.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder7);

  const creditReservesOrder8 = new CreditReserveOrder();
  creditReservesOrder8.branchCode = '305';
  creditReservesOrder8.accountCode = '100003';
  creditReservesOrder8.brandCode = '1000';
  creditReservesOrder8.orderAmount = 8000;
  creditReservesOrder8.accountType = 0;
  creditReservesOrder8.creditReservesId = ++creditReservesId;
  creditReservesOrder8.orderDate = new Date('2022-10-05');
  creditReservesOrder8.invalidCardCheckResult = '0';
  creditReservesOrder8.branchlockResult = '0';
  creditReservesOrder8.ycustomerResult = '0';
  creditReservesOrder8.moneyShortageResult = '0';
  creditReservesOrder8.nisaResult = '0';
  creditReservesOrder8.nameMatchingResult = '0';
  creditReservesOrder8.authSalesResult = '0';
  creditReservesOrder8.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder8);

  const creditReservesOrder9 = new CreditReserveOrder();
  creditReservesOrder9.branchCode = '306';
  creditReservesOrder9.accountCode = '100004';
  creditReservesOrder9.brandCode = '1001';
  creditReservesOrder9.orderAmount = 9000;
  creditReservesOrder9.accountType = 0;
  creditReservesOrder9.creditReservesId = ++creditReservesId;
  creditReservesOrder9.orderDate = new Date('2022-10-07');
  creditReservesOrder9.invalidCardCheckResult = '0';
  creditReservesOrder9.branchlockResult = '0';
  creditReservesOrder9.ycustomerResult = '0';
  creditReservesOrder9.moneyShortageResult = '0';
  creditReservesOrder9.nisaResult = '0';
  creditReservesOrder9.nameMatchingResult = '0';
  creditReservesOrder9.authSalesResult = '0';
  creditReservesOrder9.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder9);

  const creditReservesOrder10 = new CreditReserveOrder();
  creditReservesOrder10.branchCode = '307';
  creditReservesOrder10.accountCode = '100005';
  creditReservesOrder10.brandCode = '1002';
  creditReservesOrder10.orderAmount = 1000;
  creditReservesOrder10.accountType = 2;
  creditReservesOrder10.creditReservesId = ++creditReservesId;
  creditReservesOrder10.orderDate = new Date('2022-10-10');
  creditReservesOrder10.invalidCardCheckResult = '0';
  creditReservesOrder10.branchlockResult = '0';
  creditReservesOrder10.ycustomerResult = '0';
  creditReservesOrder10.moneyShortageResult = '0';
  creditReservesOrder10.nisaResult = '0';
  creditReservesOrder10.nameMatchingResult = '0';
  creditReservesOrder10.authSalesResult = '0';
  creditReservesOrder10.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder10);

  const creditReservesOrder11 = new CreditReserveOrder();
  creditReservesOrder11.branchCode = '308';
  creditReservesOrder11.accountCode = '100006';
  creditReservesOrder11.brandCode = '1003';
  creditReservesOrder11.orderAmount = 8000;
  creditReservesOrder11.accountType = 0;
  creditReservesOrder11.creditReservesId = ++creditReservesId;
  creditReservesOrder11.orderDate = new Date('2022-10-05');
  creditReservesOrder11.invalidCardCheckResult = '0';
  creditReservesOrder11.branchlockResult = '0';
  creditReservesOrder11.ycustomerResult = '0';
  creditReservesOrder11.moneyShortageResult = '0';
  creditReservesOrder11.nisaResult = '0';
  creditReservesOrder11.nameMatchingResult = '0';
  creditReservesOrder11.authSalesResult = '0';
  creditReservesOrder11.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder11);

  const creditReservesOrder12 = new CreditReserveOrder();
  creditReservesOrder12.branchCode = '309';
  creditReservesOrder12.accountCode = '100007';
  creditReservesOrder12.brandCode = '1004';
  creditReservesOrder12.orderAmount = 9000;
  creditReservesOrder12.accountType = 0;
  creditReservesOrder12.creditReservesId = ++creditReservesId;
  creditReservesOrder12.orderDate = new Date('2022-10-05');
  creditReservesOrder12.invalidCardCheckResult = '0';
  creditReservesOrder12.branchlockResult = '0';
  creditReservesOrder12.ycustomerResult = '0';
  creditReservesOrder12.moneyShortageResult = '0';
  creditReservesOrder12.nisaResult = '0';
  creditReservesOrder12.nameMatchingResult = '0';
  creditReservesOrder12.authSalesResult = '0';
  creditReservesOrder12.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder12);

  const creditReservesOrder13 = new CreditReserveOrder();
  creditReservesOrder13.branchCode = '310';
  creditReservesOrder13.accountCode = '100008';
  creditReservesOrder13.brandCode = '1005';
  creditReservesOrder13.orderAmount = 9000;
  creditReservesOrder13.accountType = 0;
  creditReservesOrder13.creditReservesId = ++creditReservesId;
  creditReservesOrder13.orderDate = new Date('2022-10-05');
  creditReservesOrder13.invalidCardCheckResult = '0';
  creditReservesOrder13.branchlockResult = '0';
  creditReservesOrder13.ycustomerResult = '0';
  creditReservesOrder13.moneyShortageResult = '0';
  creditReservesOrder13.nisaResult = '0';
  creditReservesOrder13.nameMatchingResult = '0';
  creditReservesOrder13.authSalesResult = '0';
  creditReservesOrder13.notTarget = '0';
  creditReservesOrders.push(creditReservesOrder13);

  await CreditReserveOrder.save(creditReservesOrders);
}

/**
 * create FundMsts base on link data below
 * https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
 */
async function createFundMsts() {
  const fundMsts = new Array<FundMst>();
  const fundMst1 = new FundMst();
  fundMst1.brandCode = '1000';
  fundMst1.brandName = '';
  fundMst1.tilExecutionDays = 1;
  fundMst1.tilDeliceryDays = 1;
  fundMsts.push(fundMst1);

  const fundMst2 = new FundMst();
  fundMst2.brandCode = '1001';
  fundMst2.brandName = '';
  fundMst2.tilExecutionDays = 2;
  fundMst2.tilDeliceryDays = 1;
  fundMsts.push(fundMst2);

  const fundMst3 = new FundMst();
  fundMst3.brandCode = '1002';
  fundMst3.brandName = '';
  fundMst3.tilExecutionDays = 3;
  fundMst3.tilDeliceryDays = 1;
  fundMsts.push(fundMst3);

  const fundMst4 = new FundMst();
  fundMst4.brandCode = '1003';
  fundMst4.brandName = '';
  fundMst4.tilExecutionDays = 3;
  fundMst4.tilDeliceryDays = 1;
  fundMsts.push(fundMst4);

  const fundMst5 = new FundMst();
  fundMst5.brandCode = '1004';
  fundMst5.brandName = '';
  fundMst5.tilExecutionDays = 2;
  fundMst5.tilDeliceryDays = 1;
  fundMsts.push(fundMst5);

  const fundMst6 = new FundMst();
  fundMst6.brandCode = '1005';
  fundMst6.brandName = '';
  fundMst6.tilExecutionDays = 1;
  fundMst6.tilDeliceryDays = 1;
  fundMsts.push(fundMst6);

  const fundMst7 = new FundMst();
  fundMst7.brandCode = '1006';
  fundMst7.brandName = '';
  fundMst7.tilExecutionDays = 1;
  fundMst7.tilDeliceryDays = 1;
  fundMsts.push(fundMst7);

  await FundMst.save(fundMsts);
}

/**
 * create holidays base on link data below
 * https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
 */
async function createHolidays() {
  const holidays = new Array<Holidays>();
  const holiday1 = new Holidays();
  holiday1.name = '敬老の日';
  holiday1.date = new Date('2022-09-19');
  holidays.push(holiday1);

  const holiday2 = new Holidays();
  holiday2.name = '秋分の日';
  holiday2.date = new Date('2022-09-23');
  holidays.push(holiday2);

  const holiday3 = new Holidays();
  holiday3.name = '文化の日';
  holiday3.date = new Date('2022-10-06');
  holidays.push(holiday3);

  const holiday4 = new Holidays();
  holiday4.name = 'スポーツの日';
  holiday4.date = new Date('2022-10-18');
  holidays.push(holiday4);

  const holiday5 = new Holidays();
  holiday5.name = '休暇日1';
  holiday5.date = new Date('2022-10-19');
  holidays.push(holiday5);

  await Holidays.save(holidays);
}

/**
 * create customer_order_closes base on link data below
 * https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
 */
async function createCustomerOrderCloses() {
  const customerOrderCloses = new Array<CustomerOrderCloses>();
  const orderCloses1 = new CustomerOrderCloses();
  orderCloses1.closedAt = new Date('10-05-2022 00:00:00');
  orderCloses1.handlingOn = new Date('2022-10-05');
  orderCloses1.serviceType = 30;
  customerOrderCloses.push(orderCloses1);
  const orderCloses2 = new CustomerOrderCloses();
  orderCloses2.closedAt = new Date('10-06-2022 00:00:00');
  orderCloses2.handlingOn = new Date('2022-10-06');
  orderCloses2.serviceType = 30;
  customerOrderCloses.push(orderCloses2);
  const orderCloses3 = new CustomerOrderCloses();
  orderCloses3.closedAt = new Date('10-07-2022 00:00:00');
  orderCloses3.handlingOn = new Date('2022-10-07');
  orderCloses3.serviceType = 6;
  customerOrderCloses.push(orderCloses3);
  const orderCloses4 = new CustomerOrderCloses();
  orderCloses4.closedAt = new Date('10-07-2022 00:00:00');
  orderCloses4.handlingOn = new Date('2022-10-07');
  orderCloses4.serviceType = 30;
  customerOrderCloses.push(orderCloses4);
  const orderCloses5 = new CustomerOrderCloses();
  orderCloses5.closedAt = new Date('10-11-2022 00:00:00');
  orderCloses5.handlingOn = new Date('2022-10-10');
  orderCloses5.serviceType = 30;
  customerOrderCloses.push(orderCloses5);
  const orderCloses6 = new CustomerOrderCloses();
  orderCloses6.closedAt = new Date('10-12-2022 00:00:00');
  orderCloses6.handlingOn = new Date('2022-10-12');
  orderCloses6.serviceType = 1;
  customerOrderCloses.push(orderCloses6);
  const orderCloses7 = new CustomerOrderCloses();
  orderCloses7.closedAt = new Date('10-12-2022 00:00:00');
  orderCloses7.handlingOn = new Date('2022-10-12');
  orderCloses7.serviceType = 30;
  customerOrderCloses.push(orderCloses7);
  const orderCloses8 = new CustomerOrderCloses();
  orderCloses8.closedAt = new Date('10-13-2022 00:00:00');
  orderCloses8.handlingOn = new Date('2022-10-13');
  orderCloses8.serviceType = 30;
  customerOrderCloses.push(orderCloses8);
  const orderCloses9 = new CustomerOrderCloses();
  orderCloses9.closedAt = new Date('10-14-2022 00:00:00');
  orderCloses9.handlingOn = new Date('2022-10-14');
  orderCloses9.serviceType = 30;
  customerOrderCloses.push(orderCloses9);
  const orderCloses10 = new CustomerOrderCloses();
  orderCloses10.closedAt = new Date('10-14-2022 00:00:00');
  orderCloses10.handlingOn = new Date('2022-10-14');
  orderCloses10.serviceType = 1;
  customerOrderCloses.push(orderCloses10);
  const orderCloses11 = new CustomerOrderCloses();
  orderCloses11.closedAt = new Date('10-15-2022 00:00:00');
  orderCloses11.handlingOn = new Date('2022-10-15');
  orderCloses11.serviceType = 30;
  customerOrderCloses.push(orderCloses11);
  const orderCloses12 = new CustomerOrderCloses();
  orderCloses12.closedAt = new Date('10-15-2022 00:00:00');
  orderCloses12.handlingOn = new Date('2022-10-15');
  orderCloses12.serviceType = 1;
  customerOrderCloses.push(orderCloses12);

  await CustomerOrderCloses.save(customerOrderCloses);
}

/**
 * match data base on link data below
 * https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
 */
function getExpectation() {
  const expectation = [];
  expectation.push({
    branchCode: '303',
    accountCode: '100001',
    brandCode: '1000',
    orderDate: new Date('2022/10/05'),
    workingDay: '20221005',
  });

  expectation.push({
    branchCode: '303',
    accountCode: '100001',
    brandCode: '1001',
    orderDate: new Date('2022/10/07'),
    workingDay: '20221010',
  });

  expectation.push({
    branchCode: '303',
    accountCode: '100001',
    brandCode: '1002',
    orderDate: new Date('2022/10/10'),
    workingDay: '20221012',
  });

  expectation.push({
    branchCode: '304',
    accountCode: '100002',
    brandCode: '1003',
    orderDate: new Date('2022/10/05'),
    workingDay: '20221010',
  });

  expectation.push({
    branchCode: '304',
    accountCode: '100002',
    brandCode: '1004',
    orderDate: new Date('2022/10/05'),
    workingDay: '20221007',
  });

  expectation.push({
    branchCode: '304',
    accountCode: '100002',
    brandCode: '1005',
    orderDate: new Date('2022/10/10'),
    workingDay: '20221010',
  });

  expectation.push({
    branchCode: '305',
    accountCode: '100003',
    brandCode: '1006',
    orderDate: new Date('2022/10/07'),
    workingDay: '20221007',
  });

  expectation.push({
    branchCode: '305',
    accountCode: '100003',
    brandCode: '1000',
    orderDate: new Date('2022/10/05'),
    workingDay: '20221005',
  });

  expectation.push({
    branchCode: '306',
    accountCode: '100004',
    brandCode: '1001',
    orderDate: new Date('2022/10/07'),
    workingDay: '20221010',
  });

  expectation.push({
    branchCode: '307',
    accountCode: '100005',
    brandCode: '1002',
    orderDate: new Date('2022/10/10'),
    workingDay: '20221012',
  });

  expectation.push({
    branchCode: '308',
    accountCode: '100006',
    brandCode: '1003',
    orderDate: new Date('2022/10/05'),
    workingDay: '20221010',
  });

  expectation.push({
    branchCode: '309',
    accountCode: '100007',
    brandCode: '1004',
    orderDate: new Date('2022/10/05'),
    workingDay: '20221007',
  });
  return expectation;
}

/**
 * check data import matching with data base on link data below
 * https://docs.google.com/spreadsheets/d/1ljQwA_lYZojymzXHAU_WSdwS-aYi5Nix/edit#gid=1072479611
 */
async function expectationResults() {
  const expectation = getExpectation();
  const dataSource = await connection.create();
  const results = await dataSource
    .createQueryBuilder()
    .select(
      'orders.order_date as orderDate, orders.branch_code as branchCode, orders.account_code as accountCode, ' +
        'orders.brand_code as brandCode, fmst.til_execution_days, deposit.working_day as workingDay',
    )
    .from(CreditReserveOrder, 'orders')
    .leftJoin(FundMst, 'fmst', 'fmst.brand_code = orders.brand_code')
    .leftJoin(
      SnrfileDeposits,
      'deposit',
      'orders.snrfile_deposits_id = deposit.id',
    )
    .getRawMany();
  for (const item of results) {
    // find data matching expectation
    const existed = expectation.find(
      (ex) =>
        Number(new Date(ex.orderDate)) === Number(new Date(item.orderDate)) &&
        item.branchCode === ex.branchCode &&
        item.accountCode === ex.accountCode &&
        item.brandCode === ex.brandCode,
    );
    // check if expectation have workingDay
    if (existed?.workingDay) {
      expect(item.workingDay).toEqual(existed.workingDay);
    }
  }
}
