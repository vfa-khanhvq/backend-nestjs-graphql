import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import connection from '../../test/utils/connection';
import { CreditReserveOrder } from './../../src/app/modules/credit-reserve-orders/entities/credit-reserve-order.entity';
import { getAccessToken, inserUser } from '../../test/authentication';
import { HttpExceptionFilter } from './../../src/vendors/filters/http-exception.filter';

/**
 * Test case get order list
 * https://docs.google.com/spreadsheets/d/1aw_jIWk6kAVk0ELFUsZNEL-DNF_awT3U/edit#gid=945285325
 */
jest.setTimeout(120000);
describe('get order list', () => {
  let app: INestApplication;
  let token: { accessToken: string; refreshToken: string };

  const path = '/graphql';
  const query = `query getOrderList($page: Int, $pageSize: Int) {
    getOrderList(page: $page, pageSize: $pageSize) {
      data {
        items {
          no
          month
          year
          orderDetail {
            day
            isActive
            month
          }
        }
        pagination {
          totalCount
          pageTotal
          currentPage
          pageSize
        }
      }
      message
      statusCode
      error {
        errorCode
        message
      }
    }
  }`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    app.useGlobalFilters(new HttpExceptionFilter());
    const creditReserveOrder = new CreditReserveOrder();
    creditReserveOrder.orderDate = new Date('2022-10-05');
    creditReserveOrder.accountType = 0;
    creditReserveOrder.creditReservesId = 1;
    creditReserveOrder.branchCode = '123';
    creditReserveOrder.accountCode = '123456';
    creditReserveOrder.brandCode = 'brandCode';
    creditReserveOrder.orderAmount = 1233;
    await CreditReserveOrder.save(creditReserveOrder);
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

  it('TC1 - Test get list success with pageSize and pageIndex is valid', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: 1, pageSize: 10 } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const { data, statusCode } = body.data.getOrderList;
        expect(statusCode).toEqual(HttpStatus.OK);
        const { items, pagination } = data;
        expect(items).not.toHaveLength(0);
        expect(pagination).not.toBeNull();
        expect(items).toEqual([
          {
            month: 10,
            no: 1,
            orderDetail: [{ day: 5, isActive: true, month: 10 }],
            year: 2022,
          },
        ]);
      });
  });
  it('TC2 - Test throw unauthorized', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: 1, pageSize: 10 } })
      .set('authorization', 'bearer ')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.errors).toEqual(['Unauthorized']);
      });
  });
  it('TC3 - Test get list success when pageIndex is empty', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: '', pageSize: 10 } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.errors).toEqual([
          'Variable "$page" got invalid value ""; Int cannot represent non-integer value: ""',
        ]);
      });
  });
  it('TC4 - Test get list success when pageSize is empty', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: 1, pageSize: '' } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.errors).toEqual([
          'Variable "$pageSize" got invalid value ""; Int cannot represent non-integer value: ""',
        ]);
      });
  });
  it('TC5 - Test throw error when pageIndex is null', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: null, pageSize: 1 } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.errors).toEqual(['page invalid number']);
      });
  });
  it('TC6 - Test throw error when pageSize is null', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: 1, pageSize: null } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.errors).toEqual(['pageSize invalid number']);
      });
  });
  it('TC7 - Test throw error when invalid pageIndex', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: 'ccc', pageSize: null } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.errors).toEqual([
          'Variable "$page" got invalid value "ccc"; Int cannot represent non-integer value: "ccc"',
        ]);
      });
  });
  it('TC8 - Test throw error when invalid pageSize', async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({ query, variables: { page: null, pageSize: 'ccc' } })
      .set('authorization', 'bearer ' + token.accessToken)
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.errors).toEqual([
          'Variable "$pageSize" got invalid value "ccc"; Int cannot represent non-integer value: "ccc"',
        ]);
      });
  });
});
