import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // const authHeader = request.headers?.authorization;

  // Lấy access_token từ cookie(HttpOnly)
  const token = request.cookies?.access_token;

  // Hoặc header Authorization
  // const token = request.cookies?.access_token || authHeader?.split(' ')[1];
  return token;
});
