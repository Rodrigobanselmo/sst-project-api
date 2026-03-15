import { IsString } from 'class-validator';

export class DeleteWorkspacePath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
