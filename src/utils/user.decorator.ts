import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserAuthInterface from '../types/user.interface';
export const UserDecorator = createParamDecorator<UserAuthInterface>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
