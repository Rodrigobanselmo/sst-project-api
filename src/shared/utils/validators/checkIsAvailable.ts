import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserPayloadDto } from '../../dto/user-payload.dto';

export const checkIsAvailable = (data: { id: string | number; system: boolean; companyId: string }, user: UserPayloadDto, dataType: string) => {
  if (!data.id) throw new NotFoundException(`${dataType} not found`);

  if (data.system) return true;

  if (!user.targetCompanyId) throw new BadRequestException('Company ID is missing');

  if (data.companyId !== user.targetCompanyId) throw new ForbiddenException(`You are not allowed to access this ${dataType.toLowerCase()}`);

  return true;
};
