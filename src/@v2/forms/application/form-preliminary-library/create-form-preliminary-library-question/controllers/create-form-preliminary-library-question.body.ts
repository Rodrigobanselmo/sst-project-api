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

export class CreateFormPreliminaryLibraryQuestionOptionBody {
  @IsString()
  text!: string;

  @IsInt()
  order!: number;

  @IsOptional()
  @IsInt()
  value?: number | null;
}

export class CreateFormPreliminaryLibraryQuestionBody {
  @IsString()
  name!: string;

  @IsString()
  questionText!: string;

  @IsEnum(FormPreliminaryLibraryQuestionTypeEnum)
  questionType!: FormPreliminaryLibraryQuestionTypeEnum;

  @IsEnum(FormPreliminaryLibraryCategoryEnum)
  category!: FormPreliminaryLibraryCategoryEnum;

  @IsEnum(FormIdentifierTypeEnum)
  identifierType!: FormIdentifierTypeEnum;

  @IsBoolean()
  acceptOther!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormPreliminaryLibraryQuestionOptionBody)
  @ArrayMinSize(0)
  options!: CreateFormPreliminaryLibraryQuestionOptionBody[];
}
