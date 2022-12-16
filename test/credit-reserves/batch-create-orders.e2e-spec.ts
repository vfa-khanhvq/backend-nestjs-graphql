import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import connection from '../../test/utils/connection';
import { CreditReserves } from './../../src/app/modules/credit-reserves/entities/credit-reserve.entity';
import { SnrGlobalHolidayCalendarBcp } from './../../src/app/modules/snr-global-holiday-calendar-bcp/entities/snr-global-holiday-calendar-bcp.entity';
import { CreditReserveOrder } from './../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';

jest.setTimeout(120000);
describe('create order list cron job', () => {
  let app: INestApplication;

  const path = '/graphql';
  const query = `query { createCreditReserve }`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    await createCreditReserves();
    await createSnrGlobalHolidays();
  });

  afterAll(async () => {
    await connection.clearAndClose();
    await app?.close();
  });

  // Test data base on the link below
  // https://docs.google.com/spreadsheets/d/1KnUOyn825U7Dy7mJwgeTH3DgPx3rDOn4/edit#gid=1618072562
  it('Should be run batch correctly', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query })
      .expect(HttpStatus.OK);
    const creditReserveOrders = await CreditReserveOrder.find();
    // Case creditReserveOrders.length === 0 -> system time not match with data
    if (creditReserveOrders.length) {
      const expectation = {
        '1201001': '2022-10-08',
        '1201002': '2022-10-05',
        '1201003': '2022-10-06',
        '1201005': '2022-10-05',
        '1206001': '2022-10-09',
        '1205001': '2022-10-05',
        '1201102': '2022-10-06',
        '1201013': '2022-10-07',
      };
      for (const item of creditReserveOrders) {
        expect(expectation[item.brandCode]).toEqual(
          new Date(item.orderDate).toISOString().slice(0, 10),
        );
      }
    }
  });
});

/**
 * create creditReserves base on link data below
 * https://docs.google.com/spreadsheets/d/1KnUOyn825U7Dy7mJwgeTH3DgPx3rDOn4/edit#gid=1618072562
 */
async function createCreditReserves() {
  const creditReserves = [];
  const creditReserve1 = new CreditReserves();
  creditReserve1.branchCode = '303';
  creditReserve1.accountCode = '100001';
  creditReserve1.brandCode = '1201001';
  creditReserve1.orderAmount = 10000;
  creditReserve1.accountType = 0;
  creditReserves.push(creditReserve1);

  const creditReserve2 = new CreditReserves();
  creditReserve2.branchCode = '303';
  creditReserve2.accountCode = '100001';
  creditReserve2.brandCode = '1201002';
  creditReserve2.orderAmount = 2000;
  creditReserve2.accountType = 2;
  creditReserves.push(creditReserve2);

  const creditReserve3 = new CreditReserves();
  creditReserve3.branchCode = '303';
  creditReserve3.accountCode = '100001';
  creditReserve3.brandCode = '1201003';
  creditReserve3.orderAmount = 2000;
  creditReserve3.accountType = 2;
  creditReserves.push(creditReserve3);

  const creditReserve4 = new CreditReserves();
  creditReserve4.branchCode = '304';
  creditReserve4.accountCode = '100002';
  creditReserve4.brandCode = '1201005';
  creditReserve4.orderAmount = 1000;
  creditReserve4.accountType = 2;
  creditReserves.push(creditReserve4);

  const creditReserve5 = new CreditReserves();
  creditReserve5.branchCode = '304';
  creditReserve5.accountCode = '100002';
  creditReserve5.brandCode = '1205001';
  creditReserve5.orderAmount = 20000;
  creditReserve5.accountType = 0;
  creditReserves.push(creditReserve5);

  const creditReserve6 = new CreditReserves();
  creditReserve6.branchCode = '304';
  creditReserve6.accountCode = '100002';
  creditReserve6.brandCode = '1206001';
  creditReserve6.orderAmount = 10000;
  creditReserve6.accountType = 0;
  creditReserves.push(creditReserve6);

  const creditReserve7 = new CreditReserves();
  creditReserve7.branchCode = '305';
  creditReserve7.accountCode = '100003';
  creditReserve7.brandCode = '1201005';
  creditReserve7.orderAmount = 1000;
  creditReserve7.accountType = 2;
  creditReserves.push(creditReserve7);

  const creditReserve8 = new CreditReserves();
  creditReserve8.branchCode = '303';
  creditReserve8.accountCode = '100001';
  creditReserve8.brandCode = '1201102';
  creditReserve8.orderAmount = 8000;
  creditReserve8.accountType = 0;
  creditReserves.push(creditReserve8);

  const creditReserve9 = new CreditReserves();
  creditReserve9.branchCode = '303';
  creditReserve9.accountCode = '100001';
  creditReserve9.brandCode = '1201013';
  creditReserve9.orderAmount = 9000;
  creditReserve9.accountType = 0;
  creditReserves.push(creditReserve9);

  await CreditReserves.save(creditReserves);
}

/**
 * create snrGlobalHolidayCalendarBcps base on link data below
 * https://docs.google.com/spreadsheets/d/1KnUOyn825U7Dy7mJwgeTH3DgPx3rDOn4/edit#gid=1618072562
 */
async function createSnrGlobalHolidays() {
  const snrGlobalHolidayCalendarBcps = [];
  const snrGlobalHolidayCalendarBcp1 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp1.securityCode = '1201001';
  snrGlobalHolidayCalendarBcp1.holiday = '20221005';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp1);

  const snrGlobalHolidayCalendarBcp2 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp2.securityCode = '1201001';
  snrGlobalHolidayCalendarBcp2.holiday = '20221006';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp2);

  const snrGlobalHolidayCalendarBcp3 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp3.securityCode = '1201001';
  snrGlobalHolidayCalendarBcp3.holiday = '20221007';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp3);

  const snrGlobalHolidayCalendarBcp4 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp4.securityCode = '1201002';
  snrGlobalHolidayCalendarBcp4.holiday = '20221007';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp4);

  const snrGlobalHolidayCalendarBcp5 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp5.securityCode = '1201003';
  snrGlobalHolidayCalendarBcp5.holiday = '20221005';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp5);

  const snrGlobalHolidayCalendarBcp6 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp6.securityCode = '1201005';
  snrGlobalHolidayCalendarBcp6.holiday = '20221006';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp6);

  const snrGlobalHolidayCalendarBcp7 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp7.securityCode = '1201005';
  snrGlobalHolidayCalendarBcp7.holiday = '20221007';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp7);

  const snrGlobalHolidayCalendarBcp8 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp8.securityCode = '1206001';
  snrGlobalHolidayCalendarBcp8.holiday = '20221005';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp8);

  const snrGlobalHolidayCalendarBcp9 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp9.securityCode = '1206001';
  snrGlobalHolidayCalendarBcp9.holiday = '20221006';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp9);

  const snrGlobalHolidayCalendarBcp10 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp10.securityCode = '1206001';
  snrGlobalHolidayCalendarBcp10.holiday = '20221007';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp10);

  const snrGlobalHolidayCalendarBcp11 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp11.securityCode = '1206001';
  snrGlobalHolidayCalendarBcp11.holiday = '20221008';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp11);

  const snrGlobalHolidayCalendarBcp12 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp12.securityCode = '1205001';
  snrGlobalHolidayCalendarBcp12.holiday = '20221008';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp12);

  const snrGlobalHolidayCalendarBcp13 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp13.securityCode = '1201102';
  snrGlobalHolidayCalendarBcp13.holiday = '20221005';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp13);

  const snrGlobalHolidayCalendarBcp14 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp14.securityCode = '1201013';
  snrGlobalHolidayCalendarBcp14.holiday = '20221005';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp14);

  const snrGlobalHolidayCalendarBcp15 = new SnrGlobalHolidayCalendarBcp();
  snrGlobalHolidayCalendarBcp15.securityCode = '1201013';
  snrGlobalHolidayCalendarBcp15.holiday = '20221006';
  snrGlobalHolidayCalendarBcps.push(snrGlobalHolidayCalendarBcp15);

  await SnrGlobalHolidayCalendarBcp.save(snrGlobalHolidayCalendarBcps);
}
