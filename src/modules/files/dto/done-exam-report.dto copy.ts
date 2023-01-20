import { IsOptional, IsString } from 'class-validator';

import { FindEmployeeExamHistoryDto } from './../../company/dto/employee-exam-history';
import { ReportDownloadtypeEnum } from './base-report.dto';

export class DownloudDoneExamReportDto extends FindEmployeeExamHistoryDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadtypeEnum;
}
