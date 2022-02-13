import { Role } from '../constants/authorization';
import { UserPayloadDto } from '../dto/user-payload.dto';

export const isMaster = (user: UserPayloadDto) => {
  const result = {
    isMaster: false,
    companyId: null,
  };

  user.companies.forEach((company) => {
    if (company.roles.includes(Role.MASTER)) {
      result.isMaster = true;
      result.companyId = company.companyId;
    }
  });

  return result;
};
