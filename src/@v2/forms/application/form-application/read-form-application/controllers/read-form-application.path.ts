import { IsString } from 'class-validator';

export class ReadFormApplicationPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
