import { IsOptional, IsString } from 'class-validator';

import { FindEmployeeDto } from './../../company/dto/employee.dto';
import { ReportDownloadTypeEnum } from './base-report.dto';

export class DownloadExpiredExamReportDto extends FindEmployeeDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadTypeEnum;
}
