import { IsString } from 'class-validator';

export class IndicatorsNarrativeDiagnosticPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
