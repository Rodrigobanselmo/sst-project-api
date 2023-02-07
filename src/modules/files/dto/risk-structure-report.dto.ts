import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

import { ReportDownloadTypeEnum } from './base-report.dto';

export class UploadRiskStructureReportDto {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createHierarchy?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createHomo?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class DownloadRiskStructureReportDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadTypeEnum;
}
