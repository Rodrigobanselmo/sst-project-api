import { CharacterizationTypeEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class UpsertCharacterizationDto {
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
  @IsEnum(CharacterizationTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(CharacterizationTypeEnum)}`,
  })
  type?: CharacterizationTypeEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  considerations?: string[];

  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsOptional()
  @IsString({ each: true })
  hierarchyIds?: string[];
}

export class AddPhotoCharacterizationDto {
  @IsString()
  companyCharacterizationId: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;
}
