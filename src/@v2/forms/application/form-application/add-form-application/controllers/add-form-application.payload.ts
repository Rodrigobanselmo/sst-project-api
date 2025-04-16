import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

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

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  formId!: number;

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
