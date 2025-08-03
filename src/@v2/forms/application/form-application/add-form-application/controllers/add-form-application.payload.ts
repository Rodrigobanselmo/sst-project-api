import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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

export class AddFormApplicationPayload {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  formId!: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  workspaceIds?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  hierarchyIds?: string[];

  @ValidateNested()
  @IsOptional()
  @Type(() => IdentifierDto)
  identifier?: IdentifierDto;
}
