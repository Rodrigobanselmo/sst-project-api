import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class HierarchyGroupItemBody {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  hierarchyIds!: string[];
}

export class UpsertHierarchyGroupsBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HierarchyGroupItemBody)
  groups!: HierarchyGroupItemBody[];
}
