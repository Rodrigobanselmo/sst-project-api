import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getIp } from '../utils/getIp';

export const Ip = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return getIp(request);
});
