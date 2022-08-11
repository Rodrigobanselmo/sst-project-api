import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '../../../shared/constants/enum/authorization';

export class InviteUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsInt()
  @IsOptional()
  readonly groupId?: number;

  @IsString()
  readonly companyId: string;

  @IsOptional()
  @IsString({ each: true })
  companiesIds?: string[];

  @IsString({ each: true })
  @IsOptional()
  readonly permissions: string[];

  @IsString({ each: true })
  @IsEnum(RoleEnum, {
    message: `Acesso enviado inválido`,
    each: true,
  })
  readonly roles?: RoleEnum[];
}
