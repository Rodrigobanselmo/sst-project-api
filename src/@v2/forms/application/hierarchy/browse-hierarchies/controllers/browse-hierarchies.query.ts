import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class BrowseHierarchiesQuery {
  @IsArray()
  @IsOptional()
  @IsEnum(HierarchyTypeEnum, { each: true })
  @Type(() => String)
  type?: HierarchyTypeEnum[];

  @IsString()
  @IsOptional()
  parent?: string;
}
