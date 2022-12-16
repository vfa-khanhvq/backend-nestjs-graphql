import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Health check API', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should retuen status code sucess', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.status).toEqual('OK');
      });
  });
});
