import { TaskProjectStatusEnum } from '@/@v2/task/domain/enums/task-project-status.enum';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

class MembersPayload {
  @IsInt()
  userId!: number;

  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  delete?: boolean;
}

export class EditTaskProjectPayload {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembersPayload)
  members?: MembersPayload[];

  @IsOptional()
  @IsEnum(TaskProjectStatusEnum)
  status?: TaskProjectStatusEnum;
}
