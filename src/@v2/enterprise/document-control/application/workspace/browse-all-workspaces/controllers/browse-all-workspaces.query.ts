import { WorkspaceOrderByEnum } from '@/@v2/enterprise/company/database/dao/workspace/workspace.types';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(WorkspaceOrderByEnum)
  field!: WorkspaceOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseWorkspaceQuery {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderBy)
  orderBy?: OrderBy[];
}
