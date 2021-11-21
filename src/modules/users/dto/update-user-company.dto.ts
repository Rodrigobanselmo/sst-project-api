import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UserCompanyDto } from './user-company.dto';

export class UpdateUserCompanyDto extends PartialType(UserCompanyDto) {
  @IsString()
  readonly companyId: string;

  @IsNumber()
  readonly userId: number;
}
