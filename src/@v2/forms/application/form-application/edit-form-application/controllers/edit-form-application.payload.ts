import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class QuestionDto {
  @IsBoolean()
  @IsNotEmpty()
  required!: boolean;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  order!: number;

  @IsInt()
  @IsNotEmpty()
  questionDataId!: number;
}

class IdentifierDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}

export class EditFormApplicationPayload {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FormStatusEnum)
  status?: FormStatusEnum;

  @IsInt()
  @IsOptional()
  formId?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  workspaceIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  hierarchyIds?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => IdentifierDto)
  identifier?: IdentifierDto;
}
