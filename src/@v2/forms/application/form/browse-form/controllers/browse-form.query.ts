import { FormOrderByEnum } from '@/@v2/forms/database/dao/form/form.types';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(FormOrderByEnum)
  field!: FormOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseFormQuery {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(FormTypeEnum, { each: true })
  @IsOptional()
  types?: FormTypeEnum[];

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
