import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCompanyId } from '../utils/getCompanId';
import { isMaster } from '../utils/isMater';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const companyId = getCompanyId(request);
    const authInformation = isMaster(request.user, companyId);

    return { ...request.user, ...authInformation };
  },
);
