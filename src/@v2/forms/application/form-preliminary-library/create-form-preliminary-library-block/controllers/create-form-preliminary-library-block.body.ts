import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateFormPreliminaryLibraryBlockItemBody {
  @IsString()
  libraryQuestionId!: string;

  @IsInt()
  order!: number;
}

export class CreateFormPreliminaryLibraryBlockBody {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormPreliminaryLibraryBlockItemBody)
  @ArrayMinSize(1)
  items!: CreateFormPreliminaryLibraryBlockItemBody[];
}
