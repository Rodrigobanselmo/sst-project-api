import { ReportExpiredComplementaryExamFactory } from './../../../factories/report/products/ReportExpiredComplementaryExamFactory';
import { Injectable, BadRequestException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DownloadExpiredExamReportDto } from '../../../dto/expired-exam-report.dto';

@Injectable()
export class ExamComplementaryReportService {
  constructor(private readonly reportExpiredComplementaryExamFactory: ReportExpiredComplementaryExamFactory) {}

  async execute(body: DownloadExpiredExamReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    if (!body?.companiesGroupIds?.length && !body?.companiesIds?.length) {
      throw new BadRequestException('Informe ao menos uma empresa');
    }

    const report = await this.reportExpiredComplementaryExamFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
