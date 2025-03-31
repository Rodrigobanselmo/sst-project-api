import { IsString, IsInt } from 'class-validator';

export class DeleteDocumentControlPath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlId!: number;
}
