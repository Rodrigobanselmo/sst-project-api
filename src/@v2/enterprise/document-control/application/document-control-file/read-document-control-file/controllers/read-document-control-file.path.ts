import { IsString, IsInt } from 'class-validator';

export class ReadDocumentControlFilePath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlFileId!: number;
}
