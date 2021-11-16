import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';

import { UserCompanyDto } from '../../../shared/dto/user-payload.dto';

export class PayloadTokenDto {
  @IsString()
  readonly sub: number;

  @IsString()
  @IsEmail()
  readonly email: string;

  @ValidateNested({ each: true })
  @Type(() => UserCompanyDto)
  readonly companies: UserCompanyDto[];
}
