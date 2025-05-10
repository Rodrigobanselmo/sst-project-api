import { SubTypeOrderByEnum } from '@/@v2/security/risk/database/dao/sub-type/sub-type.types';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(SubTypeOrderByEnum)
  field!: SubTypeOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseSubTypeQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsEnum(RiskTypeEnum, { each: true })
  types?: RiskTypeEnum[];

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
}
