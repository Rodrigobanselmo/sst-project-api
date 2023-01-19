import { IsOptional, IsString } from 'class-validator';

import { FindEmployeeDto } from './../../company/dto/employee.dto';
import { ReportDownloadtypeEnum } from './base-report.dto';

export class DownloudExpiredExamReportDto extends FindEmployeeDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadtypeEnum;
}
