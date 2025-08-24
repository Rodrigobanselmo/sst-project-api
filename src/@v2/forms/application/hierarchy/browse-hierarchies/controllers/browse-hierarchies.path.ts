import { IsString } from 'class-validator';

export class BrowseHierarchiesPath {
  @IsString()
  companyId!: string;
}
