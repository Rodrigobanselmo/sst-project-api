import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class EditCharacterizationPayload {
  @IsArray()
  @IsString({ each: true })
  ids!: string[];

  @IsInt()
  @IsOptional()
  stageId?: number;
}
