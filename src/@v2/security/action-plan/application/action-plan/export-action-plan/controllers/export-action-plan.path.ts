import { IsString } from 'class-validator';

export class ExportActionPlanPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
