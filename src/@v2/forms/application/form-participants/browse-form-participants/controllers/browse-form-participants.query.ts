import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
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

export class BrowseFormParticipantsQuery {
  @IsString()
  @IsOptional()
  search?: string;

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

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  onlyWithEmail?: boolean;
}
