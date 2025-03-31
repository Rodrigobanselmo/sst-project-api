import { IsInt, IsString } from 'class-validator';

export class EditDocumentControlPath {
  @IsString()
  companyId!: string;

  @IsInt()
  documentControlId!: number;
}
