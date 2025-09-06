import { IsString } from 'class-validator';

export class AssignRisksFormApplicationPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
