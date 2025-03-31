import { IsString, IsInt } from 'class-validator';

export class AddDocumentControlFilePath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlId!: number;
}
