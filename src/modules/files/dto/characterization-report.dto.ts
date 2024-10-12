import { IsOptional, IsString } from 'class-validator';
import { FindCompaniesDto } from '../../company/dto/company.dto';
import { BaseReportDto, ReportDownloadTypeEnum } from './base-report.dto';

export class DownloudCharacterizationReportDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadTypeEnum;

  @IsString()
  workspaceId: string;
}
