import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ExamTechnicalSuggestionQuery {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  riskFactorId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  examId!: number;
}
