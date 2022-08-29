import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCompanyDto {
  @IsNumber()
  readonly companyId: string;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}

export class UserPayloadDto extends UserCompanyDto {
  @IsInt()
  readonly userId: number;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsBoolean()
  isMaster: boolean;

  @IsBoolean()
  isSystem: boolean;

  @IsOptional()
  @IsString()
  targetCompanyId?: string;
}
