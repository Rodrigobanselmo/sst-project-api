import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class MembersPayload {
  @IsNumber()
  userId!: number;
}

export class AddTaskProjectPayload {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MembersPayload)
  members!: MembersPayload[];
}
