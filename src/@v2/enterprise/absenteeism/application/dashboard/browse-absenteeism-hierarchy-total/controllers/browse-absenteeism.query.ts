import { AbsenteeismHierarchyTotalOrderByEnum } from '@/@v2/enterprise/absenteeism/database/dao/absenteeism-metrics/absenteeism-metrics.types';
import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(AbsenteeismHierarchyTotalOrderByEnum)
  field!: AbsenteeismHierarchyTotalOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseAbsenteeismQuery {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(AbsenteeismHierarchyTypeEnum)
  @IsOptional()
  type?: AbsenteeismHierarchyTypeEnum;

  @IsString({ each: true })
  @IsOptional()
  workspacesIds?: string[];

  @IsString({ each: true })
  @IsOptional()
  hierarchiesIds?: string[];

  @IsInt({ each: true })
  @IsOptional()
  motivesIds?: number[];

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

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
