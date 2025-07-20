import { IsNumberString, IsString } from 'class-validator';

export class EditFormPath {
  @IsString()
  companyId!: string;

  @IsNumberString()
  formId!: string;
}
