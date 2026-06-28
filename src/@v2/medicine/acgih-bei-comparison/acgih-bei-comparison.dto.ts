import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  PcmsoAcgihBeiComparisonDecisionEnum,
  PcmsoAcgihBeiIndicatorConfidenceEnum,
} from '@prisma/client';

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

  // 4O.1 — filtro pela decisão técnica registrada na linha.
  @IsOptional()
  @IsEnum(PcmsoAcgihBeiComparisonDecisionEnum)
  reviewDecision?: PcmsoAcgihBeiComparisonDecisionEnum;

  // 4O.1 — 'true' = só com decisão; 'false' = só sem decisão.
  @IsOptional()
  @IsIn(['true', 'false'])
  hasReview?: 'true' | 'false';
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

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiComparisonDecisionEnum)
  reviewDecision?: PcmsoAcgihBeiComparisonDecisionEnum;

  @IsOptional()
  @IsIn(['true', 'false'])
  hasReview?: 'true' | 'false';
}

/** 4O.1 — corpo para registrar/atualizar a decisão técnica de uma linha. */
export class UpsertComparisonReviewBody {
  @IsString()
  @IsNotEmpty()
  acgihBeiIndicatorId!: string;

  @IsEnum(PcmsoAcgihBeiComparisonDecisionEnum)
  decision!: PcmsoAcgihBeiComparisonDecisionEnum;

  // Nota técnica OBRIGATÓRIA em todas as decisões (4O.1).
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  technicalNote!: string;
}
