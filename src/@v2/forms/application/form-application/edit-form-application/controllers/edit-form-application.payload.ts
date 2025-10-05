import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, ValidateNested } from 'class-validator';

class FormQuestionOptionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsInt()
  value?: number;
}

class FormQuestionDetailsDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsEnum(FormQuestionTypeEnum)
  @IsNotEmpty()
  type!: FormQuestionTypeEnum;

  @IsEnum(FormIdentifierTypeEnum)
  @IsNotEmpty()
  identifierType!: FormIdentifierTypeEnum;

  @IsOptional()
  @IsBoolean()
  acceptOther?: boolean;
}

class QuestionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsBoolean()
  @IsNotEmpty()
  required!: boolean;

  @ValidateNested()
  @Type(() => FormQuestionDetailsDto)
  @IsNotEmpty()
  details!: FormQuestionDetailsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormQuestionOptionDto)
  options?: FormQuestionOptionDto[];
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

  @IsString()
  @IsOptional()
  formId?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  workspaceIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  hierarchyIds?: string[];

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsBoolean()
  shareableLink?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdentifierDto)
  identifier?: IdentifierDto;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  participationGoal?: number;
}
