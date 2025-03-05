import { IsString } from 'class-validator';

export class AddActionPlanPhotoPayload {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;
}
