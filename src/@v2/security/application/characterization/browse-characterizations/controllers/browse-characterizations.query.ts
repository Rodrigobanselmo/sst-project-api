import { CharacterizationOrderByEnum } from '@/@v2/security/database/dao/characterization/characterization.types';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(CharacterizationOrderByEnum)
  field: CharacterizationOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  direction: OrderByDirectionEnum;
}

export class BrowseCharacterizationQuery {
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
  @IsOptional()
  orderBy?: OrderBy[];
}


