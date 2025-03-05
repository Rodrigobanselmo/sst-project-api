import { IsString } from 'class-validator';

export class FindActionPlanPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  recommendationId!: string;
}
