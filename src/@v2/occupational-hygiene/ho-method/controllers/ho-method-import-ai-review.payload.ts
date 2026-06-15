import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { HoMethodImportParseResult } from '../import/ho-method-import.types';
import { HoMethodImportAiReviewCatalogItem } from '../import/ho-method-import-ai-review.types';

class HoMethodImportAiReviewCatalogItemDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  synonyms?: string[];
}

export class HoMethodImportAiReviewPayload {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  originalFileName?: string;

  @IsObject()
  parserResult!: HoMethodImportParseResult;

  @IsString()
  extractedText!: string;

  @IsOptional()
  @IsString()
  customPrompt?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoMethodImportAiReviewCatalogItemDto)
  registeredSamplers?: HoMethodImportAiReviewCatalogItem[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoMethodImportAiReviewCatalogItemDto)
  registeredExtractionSolvents?: HoMethodImportAiReviewCatalogItem[];
}
