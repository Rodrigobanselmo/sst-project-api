import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { StatusEnum } from '@prisma/client';

export class UserCompanyEditDto {
  @IsNumber()
  readonly userId: number;

  @IsString({ each: true })
  @IsOptional()
  readonly roles?: string[];

  @IsString({ each: true })
  @IsOptional()
  readonly permissions?: string[];

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;
}
