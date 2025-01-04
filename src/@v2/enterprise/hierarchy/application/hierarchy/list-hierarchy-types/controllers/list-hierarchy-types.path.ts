import { IsString } from 'class-validator';

export class ListHierarchyTypesPath {
  @IsString()
  companyId!: string;
}
