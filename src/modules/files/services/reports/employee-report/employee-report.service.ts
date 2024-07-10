import { Injectable } from '@nestjs/common';
import { ReportEmployeeModelFactory } from './../../../factories/report/products/ReportEmployeeFactory';

import { DownloadEmployeeReportDto } from 'src/modules/files/dto/employee-report.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class EmployeeReportService {
  constructor(private readonly reportEmployeeFactory: ReportEmployeeModelFactory) {}

  async execute(body: DownloadEmployeeReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    const report = await this.reportEmployeeFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
