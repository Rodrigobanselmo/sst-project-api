import { IsBoolean, IsEmail, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../shared/decorators/boolean.decorator';

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

  @IsString()
  @IsOptional()
  readonly ip?: string;

  @IsBoolean()
  @ToBoolean()
  isMaster: boolean;

  @IsBoolean()
  @ToBoolean()
  isSystem: boolean;

  @IsOptional()
  @IsString()
  targetCompanyId?: string;
}
