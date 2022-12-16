import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { User } from '../src/app/modules/auth/entities/user.entity';
import { SALT_ROUNDS } from '../src/configs/constants/auth';
import * as bcrypt from 'bcrypt';

const path = '/graphql';

const queryLogin = `
query login($email: String!, $password: String!, $grantType: String) {
  login(input: { email: $email, password: $password,grantType: $grantType  }) {
    statusCode
    data {
      tokenType
      accessToken {
        accessToken
        expiredAt
      }
      refreshToken {
        refreshToken
        expiredAt
      }
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

export async function getAccessToken(app, variables) {
  let token;
  await request(app.getHttpServer())
    .post(path)
    .send({ query: queryLogin, variables })
    .expect(HttpStatus.OK)
    .expect(({ body }) => {
      const { statusCode, data } = body.data.login;
      expect(statusCode).toEqual(HttpStatus.OK);
      token = {
        accessToken: data.accessToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
      };
    });
  return token;
}

export async function inserUser(email, password) {
  const newUser = (await User.findOne({ where: { email } })) || new User();
  newUser.email = email;
  newUser.role = 0;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();
}

export async function inserSuperAdmin(email, password) {
  const newUser =
    (await User.findOne({ where: { email, role: 1 } })) || new User();
  newUser.email = email;
  newUser.role = 1;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();
}
