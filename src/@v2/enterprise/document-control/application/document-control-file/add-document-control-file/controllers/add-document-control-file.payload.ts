import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class AddDocumentControlFilePayload {
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

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  companyId!: string;

  @IsInt()
  documentControlId!: number;
}
