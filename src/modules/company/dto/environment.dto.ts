import { CompanyEnvironmentTypesEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { StringCapitalizeTransform } from 'src/shared/transformers/string-capitalize';
import { StringCapitalizeParagraphTransform } from 'src/shared/transformers/string-capitalize-paragraph';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class UpsertEnvironmentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(CompanyEnvironmentTypesEnum, {
    message: `type must be one of: ${KeysOfEnum(CompanyEnvironmentTypesEnum)}`,
  })
  type?: CompanyEnvironmentTypesEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentEnvironmentId?: string;

  @IsOptional()
  @IsString({ each: true })
  hierarchyIds?: string[];
}

export class UpsertPhotoEnvironmentDto {
  @IsString()
  id: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;
}
