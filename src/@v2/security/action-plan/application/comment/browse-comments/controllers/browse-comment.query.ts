import { CommentOrderByEnum } from '@/@v2/security/action-plan/database/dao/comment/comment.types';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { CommentTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-type.enum';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderBy {
  @IsEnum(CommentOrderByEnum)
  field!: CommentOrderByEnum;

  @IsEnum(OrderByDirectionEnum)
  order!: OrderByDirectionEnum;
}

export class BrowseCommentsQuery {
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
  creatorsIds?: number[];

  @IsArray()
  @IsOptional()
  @IsEnum(CommentTypeEnum, { each: true })
  type?: CommentTypeEnum[];

  @IsArray()
  @IsOptional()
  @IsEnum(CommentTextTypeEnum, { each: true })
  textType?: CommentTextTypeEnum[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  workspaceIds?: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isApproved?: boolean | null;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  generateSourceIds?: string[];
}
