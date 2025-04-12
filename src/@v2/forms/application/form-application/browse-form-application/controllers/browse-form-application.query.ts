import { FormApplicationOrderByEnum } from '@/@v2/forms/database/dao/form-application/form-application.types';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(FormApplicationOrderByEnum)
  field!: FormApplicationOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseFormApplicationQuery {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(FormStatusEnum, { each: true })
  @IsOptional()
  status?: FormStatusEnum[];

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
