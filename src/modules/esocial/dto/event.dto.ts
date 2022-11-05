import { QueryArray } from './../../../shared/transformers/query-array';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseEventDto {
  @IsOptional()
  @IsInt()
  tpAmb?: number;

  @IsOptional()
  @IsInt()
  procEmi?: number;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class Event2220Dto extends BaseEventDto {}

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
