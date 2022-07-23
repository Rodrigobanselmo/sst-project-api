import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../shared/constants/enum/authorization';

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
  // @IsEnum(PermissionEnum, {
  //   message: `wrong permission value sent`,
  //   each: true,
  // })
  // readonly permissions: PermissionEnum[];
  readonly permissions: string[];

  @IsString({ each: true })
  @IsEnum(RoleEnum, {
    message: `wrong role value sent`,
    each: true,
  })
  readonly roles?: RoleEnum[];
}
