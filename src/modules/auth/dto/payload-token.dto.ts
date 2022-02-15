import { IsEmail, IsString } from 'class-validator';

import { UserCompanyDto } from '../../../shared/dto/user-payload.dto';

export class PayloadTokenDto extends UserCompanyDto {
  @IsString()
  readonly sub: number;

  @IsString()
  @IsEmail()
  readonly email: string;
}
