/* eslint-disable @typescript-eslint/ban-types */
import { Role } from '../constants/enum/authorization';
import { UserPayloadDto } from '../dto/user-payload.dto';

export interface IMasterReturn {
  isMaster: boolean;
  companyId: string;
}

export const isMaster = (
  user: UserPayloadDto | undefined,
  companyId?: string | false,
) => {
  const includeMaster = user && user.roles && user.roles.includes(Role.MASTER);
  const sameCompany = companyId ? user.companyId === companyId : true;

  return {
    isMaster: includeMaster && sameCompany,
    companyId: user.companyId,
    targetCompanyId: companyId || user.companyId,
  };
};
