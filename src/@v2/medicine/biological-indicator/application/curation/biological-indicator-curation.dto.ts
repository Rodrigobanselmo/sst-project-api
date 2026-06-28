import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

export class BrowseBiologicalIndicatorsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  substanceName?: string;

  @IsOptional()
  @IsString()
  cas?: string;

  @IsOptional()
  @IsEnum(BiologicalIndicatorTableEnum)
  tableNumber?: BiologicalIndicatorTableEnum;

  @IsOptional()
  @IsEnum(BiologicalIndicatorTypeEnum)
  indicatorType?: BiologicalIndicatorTypeEnum;

  @IsOptional()
  @IsEnum(BiologicalIndicatorStatusEnum)
  status?: BiologicalIndicatorStatusEnum;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  requiresNormativeReview?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSubstanceGroup?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasConfirmedRisk?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasConfirmedExam?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasPendency?: boolean;
}

export class BiologicalIndicatorIdPath {
  @IsString()
  id!: string;
}

export class BiologicalIndicatorLinkIdPath {
  @IsString()
  id!: string;
}

export class SearchExamCandidatesQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class UpdateIndicatorStatusBody {
  @IsEnum(BiologicalIndicatorStatusEnum)
  status!: BiologicalIndicatorStatusEnum;

  @IsOptional()
  @IsString()
  reviewNotes?: string;
}

export class UpdateReviewNotesBody {
  @IsString()
  reviewNotes!: string;
}

export type RematchTarget = 'RISK' | 'EXAM' | 'BOTH';

export class RematchBody {
  @IsIn(['RISK', 'EXAM', 'BOTH'])
  target!: RematchTarget;

  @IsBoolean()
  dryRun!: boolean;
}

export class CreateExamLinkBody {
  @Type(() => Number)
  @IsInt()
  examId!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CurationNotesBody {
  @IsOptional()
  @IsString()
  notes?: string;
}
