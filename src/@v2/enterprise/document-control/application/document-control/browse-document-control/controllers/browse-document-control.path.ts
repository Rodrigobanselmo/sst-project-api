import { IsString } from 'class-validator';

export class BrowseDocumentControlPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
