import { IsOptional, IsString } from 'class-validator';
import { FindCompaniesDto } from '../../../modules/company/dto/company.dto';
import { BaseReportDto, ReportDownloadTypeEnum } from './base-report.dto';

export class DownloudClinicReportDto extends FindCompaniesDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadTypeEnum;
}
