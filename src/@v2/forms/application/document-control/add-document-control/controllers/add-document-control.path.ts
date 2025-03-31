import { IsString } from 'class-validator';

export class AddDocumentControlPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
