import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ReportClinicFactory } from '../../../factories/report/products/ReportClinicFactory';
import { DownloudClinicReportDto } from './../../../dto/clinic-report.dto';

@Injectable()
export class ClinicReportService {
  constructor(private readonly reportClinicFactory: ReportClinicFactory) {}

  async execute(body: DownloudClinicReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    const report = await this.reportClinicFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
