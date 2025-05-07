import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class ResponsiblePayload {
  @IsInt()
  userId!: number;
}

class PhotoPayload {
  @IsOptional()
  @IsString()
  fileId?: string;

  @IsOptional()
  @IsInt()
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
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsDate()
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

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priority?: number;
}
