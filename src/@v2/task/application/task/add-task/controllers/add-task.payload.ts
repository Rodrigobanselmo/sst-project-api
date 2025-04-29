import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class ResponsiblePayload {
  @IsNumber()
  userId!: number;
}

class PhotoPayload {
  @IsString()
  fileId!: string;
}

class ActionPlanPayload {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;
}

export class AddTaskPayload {
  @IsString()
  description!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  doneDate?: Date;

  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ResponsiblePayload)
  responsible!: ResponsiblePayload[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PhotoPayload)
  photos!: PhotoPayload[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ActionPlanPayload)
  actionPlan?: ActionPlanPayload;
}
