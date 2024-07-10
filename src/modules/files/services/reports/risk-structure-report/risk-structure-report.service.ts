import { DownloadRiskStructureReportDto } from './../../../dto/risk-structure-report.dto';
import { ReportRiskStructureFactory } from '../../../factories/report/products/ReportRiskStructureFactory';
import { ReportRiskStructureRsDataFactory } from '../../../factories/report/products/ReportRiskStructureRsData/ReportRiskStructureFactory.rsdata';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class RiskStructureReportService {
  constructor(
    private readonly reportRiskStructureFactory: ReportRiskStructureFactory,
    private readonly reportRiskStructureRsDataFactory: ReportRiskStructureRsDataFactory,
  ) {}

  async execute(body: DownloadRiskStructureReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    // const companyId = "96495589-43f4-493a-b065-e41fd2561153"
    delete body.downloadType;

    if (body.externalSystem == 'RS_DATA') {
      const report = await this.reportRiskStructureRsDataFactory.execute({ downloadType, companyId, body });
      return report;
    }

    const report = await this.reportRiskStructureFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
