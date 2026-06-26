import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  PcmsoEsocialProcedureSourceEnum,
  PcmsoEsocialProcedureStatusEnum,
  PcmsoEsocialProcedureTypeEnum,
} from '@prisma/client';

export class BrowseEsocialProceduresQuery {
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
  @IsEnum(PcmsoEsocialProcedureStatusEnum)
  status?: PcmsoEsocialProcedureStatusEnum;

  @IsOptional()
  @IsEnum(PcmsoEsocialProcedureTypeEnum)
  technicalType?: PcmsoEsocialProcedureTypeEnum;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOccupationalRelevant?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyCurated?: boolean;
}

export class EsocialProcedureCodePath {
  @IsString()
  procedureCode!: string;
}

export class EsocialProcedureIdPath {
  @IsString()
  id!: string;
}

export class UpsertEsocialProcedureBody {
  @IsOptional()
  @IsEnum(PcmsoEsocialProcedureStatusEnum)
  status?: PcmsoEsocialProcedureStatusEnum;

  @IsOptional()
  @IsBoolean()
  isOccupationalRelevant?: boolean;

  @IsOptional()
  @IsEnum(PcmsoEsocialProcedureTypeEnum)
  technicalType?: PcmsoEsocialProcedureTypeEnum | null;

  @IsOptional()
  @IsString()
  internalNotes?: string | null;

  @IsOptional()
  @IsEnum(PcmsoEsocialProcedureSourceEnum)
  source?: PcmsoEsocialProcedureSourceEnum;
}

export class UpdateEsocialProcedureStatusBody {
  @IsEnum(PcmsoEsocialProcedureStatusEnum)
  status!: PcmsoEsocialProcedureStatusEnum;
}
