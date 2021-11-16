import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator';

export class UserCompanyDto {
  @IsNumber()
  readonly companyId: number;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}

export class UserPayloadDto {
  @IsString()
  readonly userId: number;

  @IsString()
  @IsEmail()
  readonly email: string;

  @ValidateNested({ each: true })
  @Type(() => UserCompanyDto)
  readonly companies: UserCompanyDto[];
}
