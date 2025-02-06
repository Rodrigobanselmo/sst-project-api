import { IsString, IsInt } from 'class-validator';

export class ReadDocumentControlPath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlId!: number;
}
