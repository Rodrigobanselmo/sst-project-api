import { IsString, IsInt } from 'class-validator';

export class ReadFormApplicationPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
