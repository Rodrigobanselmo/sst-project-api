import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

import { ReportDownloadTypeEnum } from './base-report.dto';
import { Type } from 'class-transformer';

export class UploadCompanyStructureReportDto {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createHierarchy?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createHomo?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createEmployee?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createHierOnHomo?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  stopFirstError?: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  createRisk?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}

export class DownloadRiskStructureReportDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadTypeEnum;

  @IsOptional()
  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  externalSystem: string;

  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startDate: Date;
}
