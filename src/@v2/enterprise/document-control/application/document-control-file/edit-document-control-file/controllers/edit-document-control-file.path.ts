import { IsString, IsInt } from 'class-validator';

export class EditDocumentControlFilePath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlFileId!: number;
}
