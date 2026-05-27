import { IsString } from 'class-validator';

export class RiskNarrativeDiagnosticPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
