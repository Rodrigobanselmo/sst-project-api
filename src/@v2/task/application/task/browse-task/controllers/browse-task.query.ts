import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { TaskOrderByEnum } from '@/@v2/task/database/dao/task/task.types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(TaskOrderByEnum)
  field!: TaskOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseTaskQuery {
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
  creatorsIds?: number[];

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  responsibleIds?: number[];

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  projectIds?: number[];

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  statusIds?: number[];

  @IsArray()
  @IsOptional()
  @Type(() => String)
  @IsString({ each: true })
  actionPlanIds?: string[];

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  priorities?: number[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isExpired?: boolean | null;
}
