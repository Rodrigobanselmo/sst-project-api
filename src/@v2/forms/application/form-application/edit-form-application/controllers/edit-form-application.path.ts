import { IsString } from 'class-validator';

export class EditFormApplicationPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
