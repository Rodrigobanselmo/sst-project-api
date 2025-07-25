import { IsString } from 'class-validator';

export class ReadFormPath {
  @IsString()
  companyId!: string;

  @IsString()
  formId!: string;
}
