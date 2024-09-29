import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DownloudCharacterizationReportDto } from '../../../dto/characterization-report.dto';
import { ReportCharacterizationFactory } from '../../../factories/report/products/ReportCharacterizationFactory';

@Injectable()
export class CharacterizationReportService {
  constructor(private readonly reportFactory: ReportCharacterizationFactory) { }

  async execute(body: DownloudCharacterizationReportDto, userPayloadDto: UserPayloadDto) {
    const downloadType = body.downloadType;
    const companyId = userPayloadDto.targetCompanyId;
    delete body.downloadType;

    const report = await this.reportFactory.execute({ downloadType, companyId, body });
    return report;
  }
}
