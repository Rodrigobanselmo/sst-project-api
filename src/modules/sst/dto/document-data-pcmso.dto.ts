import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UpsertDocumentDataDto } from './document-data.dto';

export class DocumentDataPCMSODto {
  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  validity: string;

  @IsOptional()
  @IsString({ each: true })
  complementaryDocs: string[];

  @IsOptional()
  @IsString({ each: true })
  complementarySystems: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  visitDate?: Date;
}

export class UpsertDocumentDataPCMSODto extends UpsertDocumentDataDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => DocumentDataPCMSODto)
  json?: DocumentDataPCMSODto;
}
