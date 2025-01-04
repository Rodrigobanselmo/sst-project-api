import { IsString } from 'class-validator';

export class BrowseWorkspacePath {
  @IsString()
  companyId!: string;
}
