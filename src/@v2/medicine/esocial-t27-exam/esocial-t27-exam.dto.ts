import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ToBoolean } from '@/shared/decorators/boolean.decorator';

export class SearchEsocialT27ExamsQuery {
  @IsString()
  search!: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}

export class MaterializeEsocialT27ExamBody {
  @IsString()
  esocial27Code!: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  asSystem?: boolean;
}
