import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ReportExpiredExamFactory } from '../../../factories/report/products/ReportExpiredExamFactory';
import { DownloadExpiredExamReportDto } from '../../../dto/expired-exam-report.dto';

@Injectable()
export class ExpiredExamReportService {
  constructor(private readonly reportExpiredExamFactory: ReportExpiredExamFactory) {}

  async execute(body: DownloadExpiredExamReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    const report = await this.reportExpiredExamFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
