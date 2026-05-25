import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyAiAnalysisAsRiskDataPath {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  applicationId!: string;
}
