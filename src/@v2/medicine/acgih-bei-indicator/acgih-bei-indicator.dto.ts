import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

import {
  PcmsoAcgihBeiIndicatorConfidenceEnum,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';

export class BrowseAcgihBeiIndicatorsQuery {
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
  biologicalMatrix?: string;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorStatusEnum)
  status?: PcmsoAcgihBeiIndicatorStatusEnum;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorConfidenceEnum)
  confidence?: PcmsoAcgihBeiIndicatorConfidenceEnum;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorSourceEnum)
  source?: PcmsoAcgihBeiIndicatorSourceEnum;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyCurated?: boolean;
}

export class AcgihBeiIndicatorIdPath {
  @IsString()
  id!: string;
}

export class CreateAcgihBeiIndicatorBody {
  @IsString()
  substanceName!: string;

  @IsOptional()
  @IsString()
  cas?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2200)
  referenceYear?: number | null;

  @IsOptional()
  @IsString()
  determinant?: string | null;

  @IsOptional()
  @IsString()
  biologicalMatrix?: string | null;

  @IsOptional()
  @IsString()
  samplingTime?: string | null;

  @IsOptional()
  @IsString()
  beiValue?: string | null;

  @IsOptional()
  @IsString()
  unit?: string | null;

  @IsOptional()
  @IsString()
  notation?: string | null;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorStatusEnum)
  status?: PcmsoAcgihBeiIndicatorStatusEnum;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorSourceEnum)
  source?: PcmsoAcgihBeiIndicatorSourceEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2200)
  sourceYear?: number | null;

  @IsOptional()
  @IsBoolean()
  isCurated?: boolean;

  @IsOptional()
  @IsEnum(PcmsoAcgihBeiIndicatorConfidenceEnum)
  confidence?: PcmsoAcgihBeiIndicatorConfidenceEnum | null;

  @IsOptional()
  @IsString()
  internalNotes?: string | null;

  @IsOptional()
  @IsString()
  sourcePage?: string | null;
}

export class UpdateAcgihBeiIndicatorBody extends CreateAcgihBeiIndicatorBody {
  @IsOptional()
  @IsString()
  declare substanceName: string;
}

export class UpdateAcgihBeiIndicatorStatusBody {
  @IsEnum(PcmsoAcgihBeiIndicatorStatusEnum)
  status!: PcmsoAcgihBeiIndicatorStatusEnum;
}

/** Frase de dupla confirmação que o MASTER deve digitar para aplicar o import. */
export const ACGIH_BEI_APPLY_CONFIRM_TEXT = 'APLICAR CURADORIA ACGIH BEI';

export class ImportAcgihBeiApplyBody {
  /** Multipart envia booleano como string — deve ser o literal "true". */
  @IsBooleanString()
  confirmApply!: string;

  @Matches(new RegExp(`^${ACGIH_BEI_APPLY_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${ACGIH_BEI_APPLY_CONFIRM_TEXT}".`,
  })
  confirmText!: string;
}
