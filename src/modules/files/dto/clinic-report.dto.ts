import { IsOptional, IsString } from 'class-validator';
import { FindCompaniesDto } from '../../../modules/company/dto/company.dto';
import { BaseReportDto, ReportDownloadtypeEnum } from './base-report.dto';

export class DownloudClinicReportDto extends FindCompaniesDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadtypeEnum;
}
