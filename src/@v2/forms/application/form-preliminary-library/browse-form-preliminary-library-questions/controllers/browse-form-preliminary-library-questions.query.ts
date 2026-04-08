import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FormPreliminaryLibraryCategoryEnum } from '@prisma/client';

export class BrowseFormPreliminaryLibraryQuestionsQuery {
  @IsOptional()
  @IsEnum(FormPreliminaryLibraryCategoryEnum)
  category?: FormPreliminaryLibraryCategoryEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
