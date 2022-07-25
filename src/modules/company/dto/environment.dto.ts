import { CharacterizationTypeEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

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
  @IsEnum(CharacterizationTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(CharacterizationTypeEnum)}`,
  })
  type?: CharacterizationTypeEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  description?: string;

  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsInt()
  @IsOptional()
  order?: number;

  @IsOptional()
  @IsString({ each: true })
  hierarchyIds?: string[];

  @IsOptional()
  @IsString({ each: true })
  considerations?: string[];

  @IsOptional()
  @IsString({ each: true })
  activities?: string[];

  @IsOptional()
  @IsString()
  noiseValue?: string;

  @IsOptional()
  @IsString()
  temperature?: string;

  @IsOptional()
  @IsString()
  moisturePercentage?: string;

  @IsOptional()
  @IsString()
  luminosity?: string;

  @IsOptional()
  @IsString()
  profileName: string;

  @IsOptional()
  @IsString()
  profileParentId: string;
}

export class AddPhotoEnvironmentDto {
  @IsString()
  companyCharacterizationId: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;
}

export class UpdatePhotoEnvironmentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsInt()
  @IsOptional()
  order: number;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;
}
