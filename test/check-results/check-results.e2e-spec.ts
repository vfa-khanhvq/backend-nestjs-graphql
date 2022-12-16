import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import connection from '../../test/utils/connection';
import { getAccessToken, inserUser } from '../authentication';
import { HttpExceptionFilter } from './../../src/vendors/filters/http-exception.filter';
import {
  createCreditReservesOrders2,
  createFundMsts,
  createSnrGlobalHolidays,
  createCreditCardInfo,
  createsnrCustomers,
  createSnrOrderLocks,
  createSnrCustomerAccountBalanceBcps,
  createWB4NisaLimitDatas,
  createWb4AccountMsts,
} from './insert-date';
import { CreditReserveOrder } from './../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { In } from 'typeorm';
import * as moment from 'moment';

jest.setTimeout(120000);
describe('create payments', () => {
  let app: INestApplication;

  const path = '/graphql';
  const query = `mutation handleCheckResults($input: InputCheckResults) {
    handleCheckResults(input: $input) {
      statusCode
      message
      error {
        errorCode
        message
        details {
          message
          type
          key
          value
        }
      }
    }
  }`;
  let token: { accessToken: string; refreshToken: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    app.useGlobalFilters(new HttpExceptionFilter());
    await createCreditReservesOrders2();
    await createFundMsts();
    await createSnrGlobalHolidays();
    await createCreditCardInfo();
    await createsnrCustomers();
    await createSnrOrderLocks();
    await createSnrCustomerAccountBalanceBcps();
    await createWB4NisaLimitDatas();
    await createWb4AccountMsts();

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
  // https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
  // Test data have 3 day -> just test 3 day
  describe('Should be run correctly', () => {
    it('Should be run correctly day 8', async () => {
      const orderDate = moment().year() + '-' + moment().month() + '-' + '08';
      await request(app.getHttpServer())
        .post(path)
        .send({ query, variables: { input: { orderDate } } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .then(async ({ body }) => {
          const { statusCode } = body.data.handleCheckResults;
          expect(statusCode).toEqual(HttpStatus.OK);

          const data = await CreditReserveOrder.createQueryBuilder()
            .where({
              orderDate,
              accountType: In(['0', '2']),
              notTarget: '0',
            })
            .getMany();
          expectationResults(data);
        });
    });
  });
});

/**
 * check data import matching with data base on link data below
 * https://docs.google.com/spreadsheets/d/1lmq5a5LNJKadBeznC77PAtgBiHul5pBwG8YhuZ8RcP8/edit#gid=1987785313
 */
function expectationResults(results) {
  const orderDate = moment().year() + '-' + moment().month() + '-' + '08';
  const expectation = {
    1: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    2: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    3: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    4: {
      orderDate,
      invalidCardCheckResult: '1',
      ycustomerResult: null,
      branchlockResult: null,
      moneyShortageResult: null,
      nisaResult: null,
    },
    5: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    6: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    7: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    8: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      // nisaResult: '1',
    },
    9: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    10: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    11: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    12: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    13: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    14: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    15: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    16: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    17: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    18: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    19: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    20: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    21: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    22: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    23: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    24: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    25: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    26: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    27: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    28: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    29: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    30: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    31: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    32: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    33: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    34: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    35: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    36: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    37: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    38: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    39: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    40: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    41: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    42: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    43: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    44: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    45: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    46: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    47: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    48: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    49: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    50: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    51: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    52: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    53: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '1',
      nisaResult: null,
    },
    54: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    55: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    56: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    57: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '1',
    },
    58: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    59: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
    60: {
      orderDate,
      invalidCardCheckResult: '0',
      ycustomerResult: '0',
      branchlockResult: '0',
      moneyShortageResult: '0',
      nisaResult: '0',
    },
  };
  results.forEach((item, index) => {
    console.log(item);
    console.log(index + 1);
    console.log(expectation[index + 1]);

    const matchingExpectation = expectation[index + 1];
    for (const key in matchingExpectation) {
      if (item.hasOwnProperty(key)) {
        expect(item[key]).toEqual(matchingExpectation[key]);
      }
    }
  });
}
