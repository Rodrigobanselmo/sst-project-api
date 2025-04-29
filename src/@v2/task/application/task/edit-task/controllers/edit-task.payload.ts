import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResponsiblePayload {
  @IsNumber()
  userId!: number;
}

class PhotoPayload {
  @IsOptional()
  @IsString()
  fileId?: string;

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  delete?: boolean;
}

class ActionPlanPayload {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;
}

export class EditTaskPayload {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsDateString()
  doneDate?: Date;

  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponsiblePayload)
  responsible?: ResponsiblePayload[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoPayload)
  photos?: PhotoPayload[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ActionPlanPayload)
  actionPlan?: ActionPlanPayload;
}
