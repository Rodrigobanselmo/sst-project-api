import { CharacterizationTypeEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

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
  paragraphs?: string[];

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
  profileName?: string;

  @IsOptional()
  @IsString()
  profileParentId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status?: StatusEnum;
}

export class AddPhotoCharacterizationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  companyCharacterizationId: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(500, {
    message: 'A imagem deve ter uma descrição com até 250 caracteres',
  })
  name: string;
}

export class UpdatePhotoCharacterizationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsInt()
  @IsOptional()
  order: number;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'A imagem deve ter uma descrição com até 250 caracteres',
  })
  name: string;
}

export class CopyCharacterizationDto {
  @IsString()
  companyCopyFromId: string;

  @IsString()
  workspaceId: string;

  @IsString({ each: true })
  characterizationIds: string[];
}
