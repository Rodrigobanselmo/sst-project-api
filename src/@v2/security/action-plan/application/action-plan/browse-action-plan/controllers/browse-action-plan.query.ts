import { ActionPlanOrderByEnum } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.types';
import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { IRiskLevelValues } from '@/@v2/shared/domain/types/security/risk-level-values.type';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  @IsEnum(ActionPlanStatusEnum, { each: true })
  status?: ActionPlanStatusEnum[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  generateSourceIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  hierarchyIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  recommendationIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  riskIds?: string[];

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  responisbleIds?: number[];

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Type(() => Number)
  ocupationalRisks?: IRiskLevelValues[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isExpired?: boolean | null;
}
