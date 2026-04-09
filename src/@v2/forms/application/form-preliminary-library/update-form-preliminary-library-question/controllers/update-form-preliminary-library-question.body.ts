import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  FormIdentifierTypeEnum,
  FormPreliminaryLibraryCategoryEnum,
  FormPreliminaryLibraryQuestionTypeEnum,
} from '@prisma/client';
import { CreateFormPreliminaryLibraryQuestionOptionBody } from '../../create-form-preliminary-library-question/controllers/create-form-preliminary-library-question.body';

export class UpdateFormPreliminaryLibraryQuestionBody {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  questionText?: string;

  @IsOptional()
  @IsEnum(FormPreliminaryLibraryQuestionTypeEnum)
  questionType?: FormPreliminaryLibraryQuestionTypeEnum;

  @IsOptional()
  @IsEnum(FormPreliminaryLibraryCategoryEnum)
  category?: FormPreliminaryLibraryCategoryEnum;

  @IsOptional()
  @IsEnum(FormIdentifierTypeEnum)
  identifierType?: FormIdentifierTypeEnum;

  @IsOptional()
  @IsBoolean()
  acceptOther?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormPreliminaryLibraryQuestionOptionBody)
  @ArrayMinSize(0)
  options?: CreateFormPreliminaryLibraryQuestionOptionBody[];
}
