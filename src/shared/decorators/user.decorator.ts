import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCompanyId } from '../utils/getCompanId';
import { isMaster } from '../utils/isMater';
import { getIp } from '../utils/getIp';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const companyId = getCompanyId(request);
  const authInformation = isMaster(request.user, companyId);
  const user = { ...request.user, ...authInformation, ip: getIp(request) };

  request.user = user;

  return user;
});
