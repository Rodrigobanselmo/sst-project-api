import { IsNumberString, IsString } from 'class-validator';

export class EditFormPath {
  @IsString()
  companyId!: string;

  @IsString()
  formId!: string;
}
