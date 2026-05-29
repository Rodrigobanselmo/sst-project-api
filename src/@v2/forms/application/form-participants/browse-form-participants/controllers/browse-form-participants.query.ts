import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';

export enum FormParticipantsOrderByEnum {
  NAME = 'NAME',
  CPF = 'CPF',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  HIERARCHY = 'HIERARCHY',
  STATUS = 'STATUS',
  CREATED_AT = 'CREATED_AT',
  HAS_RESPONDED = 'HAS_RESPONDED',
  EMAIL_SENT = 'EMAIL_SENT',
}

class OrderBy {
  @IsEnum(FormParticipantsOrderByEnum)
  field!: FormParticipantsOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

class Pagination {
  @IsInt()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsOptional()
  page?: number;
}

export class BrowseFormParticipantsQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => Pagination)
  pagination?: Pagination;

  @IsInt()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsOptional()
  page?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderBy)
  orderBy?: OrderBy[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  hierarchyIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  workspaceIds?: string[];

  /** Query string only — parsed in controller (evita Boolean("false") === true). */
  @IsOptional()
  @IsIn(['true', 'false'])
  hasResponded?: 'true' | 'false';

  @IsOptional()
  @IsIn(['true', 'false'])
  onlyWithEmail?: 'true' | 'false';
}
