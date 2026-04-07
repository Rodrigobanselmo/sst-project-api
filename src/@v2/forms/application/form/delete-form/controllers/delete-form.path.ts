import { IsString } from 'class-validator';

export class DeleteFormPath {
  @IsString()
  companyId!: string;

  @IsString()
  formId!: string;
}
