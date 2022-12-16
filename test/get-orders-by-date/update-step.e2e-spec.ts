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
import { STATUS } from '../../src/configs/constants/constant';

/**
 * Test case: https://docs.google.com/spreadsheets/d/1f6ro29p5Rdam2DB1FKr1alQsU_VphVF-/edit?usp=sharing&ouid=117747707644312189784&rtpof=true&sd=true
 */
jest.setTimeout(1200000);
describe('get order module', () => {
  let app: INestApplication;
  let token: { accessToken: string; refreshToken: string };

  const mutation = `
  mutation updateStep($orderDate: Date!, $step: Int!) {
    updateStep(input: { orderDate: $orderDate, step: $step }) {
      message
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
  const path = '/graphql';
  describe('Check Logic', () => {
    it('TC1: update step success', async () => {
      const orderDate = '2020-01-11';
      const stepUpdate = 3;
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { orderDate, step: stepUpdate } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          expect(body.data.updateStep.message).toEqual('Success');
          const queryStep = await CreditProcessStep.createQueryBuilder()
            .where({
              orderDate,
            })
            .getOne();
          expect(queryStep.orderDate).toEqual(orderDate);
          expect(queryStep.currentStep).toEqual(stepUpdate);
          expect(queryStep.status).toEqual(STATUS.WAITING);
        });
    });

    it('TC2: order date invalid', async () => {
      const orderDate = '2020-99-99';
      const stepUpdate = 3;
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { orderDate, step: stepUpdate } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          expect(body.data.updateStep.error).toEqual({
            errorCode: 'INPUT_INVALID',
            message: '"orderDate" must be a valid date',
            details: [
              {
                key: 'orderDate',
                type: 'date.base',
                value: orderDate,
                message: '"orderDate" must be a valid date',
              },
            ],
          });
          expect(body.data.updateStep.statusCode).toEqual(400);
        });
    });

    it('TC3: step invalid', async () => {
      const orderDate = '2020-01-01';
      const stepUpdate = -3;
      await request(app.getHttpServer())
        .post(path)
        .send({ query: mutation, variables: { orderDate, step: stepUpdate } })
        .set('authorization', 'bearer ' + token.accessToken)
        .expect(HttpStatus.OK)
        .expect(async ({ body }) => {
          expect(body.data.updateStep.error).toEqual({
            errorCode: 'INPUT_INVALID',
            message: '"step" must be greater than or equal to 1',
            details: [
              {
                key: 'step',
                type: 'number.min',
                value: '-3',
                message: '"step" must be greater than or equal to 1',
              },
            ],
          });
          expect(body.data.updateStep.statusCode).toEqual(400);
        });
    });
  });
});
