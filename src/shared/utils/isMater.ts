import { Role } from '../constants/enum/authorization';
import { UserPayloadDto } from '../dto/user-payload.dto';

export const isMaster = (user: UserPayloadDto) => {
  return {
    isMaster: user.roles.includes(Role.MASTER),
    companyId: user.companyId,
  };
};
