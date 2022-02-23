import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserPayloadDto } from '../../dto/user-payload.dto';

export const checkIsAvailable = (
  data: { id: string | number; system: boolean; companyId: string },
  user: UserPayloadDto,
) => {
  if (!data.id) throw new NotFoundException('Checklist not found');

  if (data.system) return data;

  if (user.targetCompanyId)
    throw new BadRequestException('Company ID is missing');

  if (data.companyId !== user.targetCompanyId)
    throw new ForbiddenException(
      'You are not allowed to access this checklist',
    );

  return data;
};
