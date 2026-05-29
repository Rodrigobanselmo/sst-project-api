import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class BrowseHierarchiesQuery {
  @IsArray()
  @IsOptional()
  @IsEnum(HierarchyTypeEnum, { each: true })
  @Type(() => String)
  type?: HierarchyTypeEnum[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  workspaceIds?: string[];

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  parent?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
