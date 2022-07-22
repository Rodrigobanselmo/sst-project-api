import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { StatusEnum } from '@prisma/client';

export class UserCompanyDto {
  @IsString()
  readonly companyId: string;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];

  @IsInt()
  @IsOptional()
  readonly groupId?: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;
}
