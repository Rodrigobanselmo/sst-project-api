import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { RoleEnum } from '../../../shared/constants/enum/authorization';
import { QueryArray } from './../../../shared/transformers/query-array';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { Transform } from 'class-transformer';
export class InviteUserDto {
  @ValidateIf((o) => o.email)
  @IsOptional()
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

export class FindInvitesDto extends PaginationQueryDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  ids?: string[];

  @IsOptional()
  @IsBoolean()
  showProfessionals?: boolean;
}
