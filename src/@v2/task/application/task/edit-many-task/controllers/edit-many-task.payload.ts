import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class ResponsiblePayload {
  @IsInt()
  userId!: number;
}

class ActionPlanPayload {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;
}

export class EditManyTaskPayload {
  @IsInt({ each: true })
  ids!: number[];

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
  @ValidateNested()
  @Type(() => ActionPlanPayload)
  actionPlan?: ActionPlanPayload;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priority?: number;
}
