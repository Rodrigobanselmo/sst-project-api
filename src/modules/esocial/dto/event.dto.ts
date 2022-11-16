import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ProcEmiEnum, TpAmbEnum } from '../interfaces/event-batch';
import { QueryArray } from './../../../shared/transformers/query-array';
import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';

export class BaseEventDto {
  @IsOptional()
  @IsInt()
  @IsEnum(TpAmbEnum, {
    message: `status must be one of: ${KeysOfEnum(TpAmbEnum)}`,
  })
  tpAmb?: TpAmbEnum;

  @IsOptional()
  @IsInt()
  @IsEnum(ProcEmiEnum, {
    message: `status must be one of: ${KeysOfEnum(ProcEmiEnum)}`,
  })
  procEmi?: number;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class Event2220Dto extends BaseEventDto {}
export class Event2240Dto extends BaseEventDto {}

export class FindEvents2220Dto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsBoolean()
  @IsOptional()
  all?: boolean;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];
}

export class FindEvents2240Dto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId: string;
}
