import { IsString } from 'class-validator';

export class DuplicateFormPath {
  @IsString()
  companyId!: string;

  @IsString()
  formId!: string;
}
