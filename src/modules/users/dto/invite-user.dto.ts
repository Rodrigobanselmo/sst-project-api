import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  PermissionEnum,
  RoleEnum,
} from 'src/shared/constants/enum/authorization';

export class InviteUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly companyId: string;

  @IsString({ each: true })
  @IsOptional()
  @IsEnum(PermissionEnum, {
    message: `wrong permission value sent`,
    each: true,
  })
  readonly permissions: PermissionEnum[];

  @IsString({ each: true })
  @IsEnum(RoleEnum, {
    message: `wrong role value sent`,
    each: true,
  })
  readonly roles?: RoleEnum[];
}
