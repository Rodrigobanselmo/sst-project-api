import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FormAnswerPayload {
  @IsString()
  questionId!: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[];
}

export class PublicSubmitFormApplicationPayload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormAnswerPayload)
  answers!: FormAnswerPayload[];
}
