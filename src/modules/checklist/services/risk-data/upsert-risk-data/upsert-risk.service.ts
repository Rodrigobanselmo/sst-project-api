import { Injectable } from '@nestjs/common';

import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class UpsertRiskDataService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(upsertRiskDataDto: UpsertRiskDataDto) {
    const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);

    return riskData;
  }
}
