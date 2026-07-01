import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { StatusEnum } from '@prisma/client';

export class BrowseMasterRiskSubTypesQuery {
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
  @IsEnum(RiskTypeEnum)
  type?: RiskTypeEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}

export class RiskSubTypeIdPath {
  @Type(() => Number)
  @IsInt()
  id!: number;
}

export class CreateMasterRiskSubTypeBody {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RiskTypeEnum)
  type!: RiskTypeEnum;
}

export class UpdateMasterRiskSubTypeBody {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;
}

export class UpdateMasterRiskSubTypeStatusBody {
  @IsEnum(StatusEnum)
  status!: StatusEnum;
}
