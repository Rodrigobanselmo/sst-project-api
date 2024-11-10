import { IsString } from 'class-validator';

export class BrowseCharacterizationPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
