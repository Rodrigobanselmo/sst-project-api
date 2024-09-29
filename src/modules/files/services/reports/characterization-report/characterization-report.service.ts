import { Injectable } from '@nestjs/common';

import { DownloudCharacterizationReportDto } from '@/modules/files/dto/characterization-report.dto';
import { ReportCharacterizationFactory } from '@/modules/files/factories/report/products/ReportCharacterizationFactory';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

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
