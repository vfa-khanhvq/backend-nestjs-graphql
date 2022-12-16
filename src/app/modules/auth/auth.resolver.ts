import { UseGuards, UsePipes } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminGuard } from '../../../vendors/guards/admin.guard';
import { BaseResolver } from '../../../vendors/base/base.resolver';
import {
  LoginResponse,
  MutationResponse,
  AddUserInput,
} from '../../graphql/graphql.schema';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ChangePasswordResponse,
  LoginDto,
  LogoutResponse,
  RefreshTokenQueryResponse,
} from './dto/auth.dto';
import * as joi from 'joi';
import { JoiValidationPipe } from '../../../vendors/pipes/joiValidation.pipe';
import { GRANT_TYPE, TOKEN_TYPE } from '../../../configs/constants/auth';
import { KeyAuthGuard } from '../../../vendors/guards/auth.guard';

@Resolver()
export class AuthResolver extends BaseResolver {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Query login: get token to authentication and authorization for user
   * @param loginInput: email, password, grantType
   * @returns
   */
  @UsePipes(
    new JoiValidationPipe<LoginDto>({
      email: joi.string().email({ tlds: { allow: false } }),
      password: joi.string().min(6).max(255),
      grantType: joi.string().valid(GRANT_TYPE).default(GRANT_TYPE),
    }),
  )
  @Query('login')
  async login(@Args('input') loginInput: LoginDto): Promise<LoginResponse> {
    const { accessToken, refreshToken, role } = await this.authService.login(
      loginInput,
    );
    return this.response({
      accessToken,
      refreshToken,
      tokenType: TOKEN_TYPE,
      role,
    });
  }

  /**
   * Query refreshToken: get new access token by refresh token without password
   * @param refreshToken
   * @returns
   */
  @Query('refreshToken')
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<RefreshTokenQueryResponse> {
    const { accessToken, expiredAt } = await this.authService.refreshToken(
      refreshToken,
    );
    return this.response({ accessToken, expiredAt });
  }

  /**
   * Mutation changePassword: update new password for user
   * @param context current user
   * @param changePassword password, newPassword
   * @returns
   */
  @UseGuards(AdminGuard)
  @UsePipes(
    new JoiValidationPipe<ChangePasswordDto>({
      password: joi.string().min(6).max(255),
      newPassword: joi
        .string()
        .min(6)
        .max(255)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        .message('Wrong password format'),
    }),
  )
  @Mutation('changePassword')
  async changePassword(
    @Context() context,
    @Args('changePassword') changePassword: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const auth = context.req.auth;
    const userId = await this.authService.changePassword(
      auth.userId,
      changePassword.password,
      changePassword.newPassword,
    );
    return this.response({ userId });
  }

  /**
   * Query logout: remove current refresh token
   * @param context
   * @returns
   */
  @UseGuards(AdminGuard)
  @Query('logout')
  async logout(@Context() context): Promise<LogoutResponse> {
    const auth = context.req.auth;
    await this.authService.logout(auth.userId);
    return this.response({ userId: auth.userId });
  }

  /**
   * Mutation addUser: add new user by admin
   * @param addUserInput
   * @returns
   */
  @UsePipes(
    new JoiValidationPipe<AddUserInput>({
      email: joi.string().email({ tlds: { allow: false } }),
      password: joi
        .string()
        .min(6)
        .max(255)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        .message('Wrong password format'),
    }),
  )
  @UseGuards(KeyAuthGuard)
  @Mutation('addUser')
  async addUser(
    @Args('input') addUserInput: AddUserInput,
  ): Promise<MutationResponse> {
    if (await this.authService.addUser(addUserInput)) {
      return this.response('success!');
    }
    return this.response('fail!');
  }
}
