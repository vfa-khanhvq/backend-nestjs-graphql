import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLE } from '../../configs/constants/auth';

// Check if username in field for query matches authenticated user's username
// or if the user is admin
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    try {
      const role = this.reflector.get<number>(ROLE, context.getHandler());
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const token = request.headers.authorization.split(' ')[1];
      const options = {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRE_TIME,
      };
      this.jwtService.verify(token, options);
      const user = this.jwtService.decode(token);
      request.auth = user;
      if (role && (user as any).role < role) {
        throw new ForbiddenException();
      }
      return super.canActivate(context);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }
  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
