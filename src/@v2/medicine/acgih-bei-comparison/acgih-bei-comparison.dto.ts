import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { PcmsoAcgihBeiIndicatorConfidenceEnum } from '@prisma/client';

import {
  AcgihBeiComparisonStatus,
  AcgihBeiSuggestedAction,
} from './acgih-bei-comparison.util';

export class BrowseAcgihBeiComparisonQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AcgihBeiComparisonStatus)
  comparisonStatus?: AcgihBeiComparisonStatus;

  @IsOptional()
  @IsEnum(AcgihBeiSuggestedAction)
  suggestedAction?: AcgihBeiSuggestedAction;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorConfidenceEnum)
  confidence?: PcmsoAcgihBeiIndicatorConfidenceEnum;
}

export class ExportAcgihBeiComparisonQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AcgihBeiComparisonStatus)
  comparisonStatus?: AcgihBeiComparisonStatus;

  @IsOptional()
  @IsEnum(AcgihBeiSuggestedAction)
  suggestedAction?: AcgihBeiSuggestedAction;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorConfidenceEnum)
  confidence?: PcmsoAcgihBeiIndicatorConfidenceEnum;
}
