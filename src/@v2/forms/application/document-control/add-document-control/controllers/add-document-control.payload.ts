import { Type } from 'class-transformer';
import { IsDate, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class FilePayload {
  @IsString()
  fileId!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsDate()
  @IsOptional()
  startDate?: Date;
}

export class AddDocumentControlPayload {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  type!: string;

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => FilePayload)
  file!: FilePayload;
}
