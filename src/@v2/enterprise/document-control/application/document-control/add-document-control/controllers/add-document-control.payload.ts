import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => FilePayload)
  file?: FilePayload;
}
