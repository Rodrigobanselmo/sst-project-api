import { IsBoolean, IsEnum, IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export class FormQuestionOptionPayload {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  text!: string;

  @IsOptional()
  @IsNumber()
  value?: number;
}

export class FormQuestionDataPayload {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  text!: string;

  @IsEnum(FormQuestionTypeEnum)
  type!: FormQuestionTypeEnum;

  @IsOptional()
  @IsBoolean()
  acceptOther?: boolean;
}

export class FormQuestionPayload {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ValidateNested()
  @Type(() => FormQuestionDataPayload)
  data!: FormQuestionDataPayload;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormQuestionOptionPayload)
  options?: FormQuestionOptionPayload[];
}

export class FormQuestionGroupPayload {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormQuestionPayload)
  questions!: FormQuestionPayload[];
}

export class EditFormPayload {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FormTypeEnum)
  type?: FormTypeEnum;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsBoolean()
  shareableLink?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormQuestionGroupPayload)
  questionGroups?: FormQuestionGroupPayload[];
}
