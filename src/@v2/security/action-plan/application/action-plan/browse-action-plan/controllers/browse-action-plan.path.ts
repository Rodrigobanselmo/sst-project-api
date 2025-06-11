import { IsString } from 'class-validator';

export class BrowseActionPlanPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
