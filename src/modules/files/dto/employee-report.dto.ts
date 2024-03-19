import { IsOptional, IsString } from 'class-validator';

import { ReportDownloadTypeEnum } from './base-report.dto';

export class DownloadEmployeeReportDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadTypeEnum;
}
