import { Injectable } from '@nestjs/common';

import { DownloudDoneExamReportDto } from '../../../../..//modules/files/dto/done-exam-report.dto copy';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ReportDoneExamFactory } from './../../../factories/report/products/ReportDoneExamFactory';

@Injectable()
export class DoneExamReportService {
  constructor(private readonly reportDoneExamFactory: ReportDoneExamFactory) {}

  async execute(body: DownloudDoneExamReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    const report = await this.reportDoneExamFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
