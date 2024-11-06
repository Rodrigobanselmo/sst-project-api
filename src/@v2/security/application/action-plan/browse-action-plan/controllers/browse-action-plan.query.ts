import { ActionPlanOrderByEnum } from '@/@v2/security/database/dao/action-plan/action-plan.types';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(ActionPlanOrderByEnum)
  field!: ActionPlanOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseActionPlanQuery {
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
  stageIds?: number[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  workspaceIds?: string[];
}


