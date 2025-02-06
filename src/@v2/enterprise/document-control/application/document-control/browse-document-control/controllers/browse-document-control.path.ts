import { IsString, IsInt } from 'class-validator';

export class BrowseDocumentControlPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
