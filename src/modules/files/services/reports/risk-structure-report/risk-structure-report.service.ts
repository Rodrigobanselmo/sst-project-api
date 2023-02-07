import { DownloadRiskStructureReportDto } from './../../../dto/risk-structure-report.dto';
import { ReportRiskStructureFactory } from '../../../factories/report/products/ReportRiskStructureFactory';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class RiskStructureReportService {
  constructor(private readonly reportRiskStructureFactory: ReportRiskStructureFactory) {}

  async execute(body: DownloadRiskStructureReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    const report = await this.reportRiskStructureFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
