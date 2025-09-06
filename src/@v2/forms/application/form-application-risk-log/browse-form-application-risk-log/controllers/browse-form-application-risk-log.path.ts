import { IsString } from 'class-validator';

export class BrowseFormApplicationRiskLogPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
