import { IsString } from 'class-validator';

export class FindActionPlanInfoPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
