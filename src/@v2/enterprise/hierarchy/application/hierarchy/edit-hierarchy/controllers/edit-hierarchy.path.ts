import { IsString } from 'class-validator';

export class EditHierarchyPath {
  @IsString()
  companyId!: string;

  @IsString()
  hierarchyId!: string;
}

