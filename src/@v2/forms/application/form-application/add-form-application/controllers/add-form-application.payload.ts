import { StatusTypeEnum } from '@/@v2/security/@shared/domain/enums/status-type.enum';
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

export class AddFormApplicationPayload {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  formId!: number;

  @IsArray()
  @IsString({ each: true })
  workspaceIds?: string[];

  @IsArray()
  @IsString({ each: true })
  hierarchyIds?: string[];

  @ValidateNested()
  @Type(() => IdentifierDto)
  identifier?: IdentifierDto;
}
