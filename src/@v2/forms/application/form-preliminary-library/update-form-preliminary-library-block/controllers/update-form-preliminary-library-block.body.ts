import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateFormPreliminaryLibraryBlockItemBody } from '../../create-form-preliminary-library-block/controllers/create-form-preliminary-library-block.body';

export class UpdateFormPreliminaryLibraryBlockBody {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormPreliminaryLibraryBlockItemBody)
  @ArrayMinSize(1)
  items?: CreateFormPreliminaryLibraryBlockItemBody[];
}
