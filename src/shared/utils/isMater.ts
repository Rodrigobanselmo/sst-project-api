/* eslint-disable @typescript-eslint/ban-types */
import { RoleEnum } from '../constants/enum/authorization';
import { UserPayloadDto } from '../dto/user-payload.dto';

export interface IMasterReturn {
  isSystem: boolean;
  companyId: string;
  targetCompanyId: string;
}

export const isMaster = (user: UserPayloadDto | undefined, companyId?: string | false) => {
  const includeMaster = user && user.roles && user.roles.includes(RoleEnum.MASTER);
  const sameCompany = companyId ? user.companyId === companyId : true;

  return {
    isMaster: includeMaster,
    isSystem: includeMaster && sameCompany,
    companyId: user.companyId,
    targetCompanyId: companyId || user.companyId,
  };
};
