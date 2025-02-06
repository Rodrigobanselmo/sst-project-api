import { IsString, IsInt } from 'class-validator';

export class DeleteDocumentControlFilePath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlFileId!: number;
}
