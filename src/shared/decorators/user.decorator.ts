import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCompanyId } from '../utils/getCompanId';
import { isMaster } from '../utils/isMater';
import { getIp } from '../utils/getIp';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const companyId = getCompanyId(request);
  const rawUser = request.user;
  const userId =
    rawUser?.userId != null
      ? Number(rawUser.userId)
      : rawUser?.id != null
        ? Number(rawUser.id)
        : undefined;
  const authInformation = isMaster(rawUser, companyId);
  const user = {
    ...rawUser,
    ...(userId != null ? { userId } : {}),
    ...authInformation,
    ip: getIp(request),
  };

  request.user = user;

  return user;
});
