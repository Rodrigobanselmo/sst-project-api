import { QueryArray } from './../../../shared/transformers/query-array';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

import { DateFormat } from '../../../shared/transformers/date-format';

export class SyncDto {
  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  lastPulledVersion?: Date;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companyIds?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companyStartIds?: string[];
}
