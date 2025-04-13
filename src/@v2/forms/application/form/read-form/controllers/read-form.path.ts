import { IsInt, IsString } from 'class-validator';

export class ReadFormPath {
  @IsString()
  companyId!: string;

  @IsInt()
  formId!: number;
}
