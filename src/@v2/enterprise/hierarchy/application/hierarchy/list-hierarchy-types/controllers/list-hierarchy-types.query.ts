import { IsOptional, IsString } from 'class-validator';

export class ListHierarchyTypesQuery {
  @IsOptional()
  @IsString()
  workspaceId?: string;
}


