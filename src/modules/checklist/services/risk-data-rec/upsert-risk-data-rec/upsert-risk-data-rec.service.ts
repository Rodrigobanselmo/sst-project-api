import { Injectable } from '@nestjs/common';
import { RiskDataRecRepository } from './../../../../../modules/checklist/repositories/implementations/RiskDataRecRepository';

import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { UpsertRiskDataRecDto } from './../../../dto/risk-data-rec.dto';

@Injectable()
export class UpsertRiskDataRecService {
  constructor(private readonly riskDataRecRepository: RiskDataRecRepository) {}

  async execute(upsertRiskDataDto: UpsertRiskDataRecDto, user: UserPayloadDto) {
    const riskDataRec = await this.riskDataRecRepository.upsert({
      ...upsertRiskDataDto,
      companyId: user.targetCompanyId,
    });
    return riskDataRec;
  }
}
