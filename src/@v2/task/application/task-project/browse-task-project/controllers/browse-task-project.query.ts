import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { TaskProjectOrderByEnum } from '@/@v2/task/database/dao/task-project/task-project.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(TaskProjectOrderByEnum)
  field!: TaskProjectOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseTaskProjectQuery {
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
  @Type(() => Number)
  @IsInt({ each: true })
  membersIds?: number[];
}
