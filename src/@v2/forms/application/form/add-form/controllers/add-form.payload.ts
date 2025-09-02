import { IsBoolean, IsEnum, IsOptional, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export class FormQuestionOptionPayload {
  @IsString()
  text!: string;

  @IsOptional()
  @IsNumber()
  value?: number;
}

export class FormQuestionDetailsPayload {
  @IsString()
  text!: string;

  @IsEnum(FormQuestionTypeEnum)
  type!: FormQuestionTypeEnum;

  @IsOptional()
  @IsBoolean()
  acceptOther?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  riskIds?: string[];
}

export class FormQuestionPayload {
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ValidateNested()
  @Type(() => FormQuestionDetailsPayload)
  details!: FormQuestionDetailsPayload;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormQuestionOptionPayload)
  options?: FormQuestionOptionPayload[];
}

export class FormQuestionGroupPayload {
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

export class AddFormPayload {
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
