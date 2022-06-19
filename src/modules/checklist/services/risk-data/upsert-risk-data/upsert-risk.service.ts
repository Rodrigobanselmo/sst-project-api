import { Injectable } from '@nestjs/common';

import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class UpsertRiskDataService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(upsertRiskDataDto: UpsertRiskDataDto) {
    const keepEmpty = upsertRiskDataDto.keepEmpty;
    delete upsertRiskDataDto.keepEmpty;

    const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);

    if (!keepEmpty) {
      const isEmpty =
        riskData.adms.length === 0 &&
        riskData.recs.length === 0 &&
        riskData.engs.length === 0 &&
        riskData.epis.length === 0 &&
        riskData.generateSources.length === 0 &&
        !riskData.probability;

      if (isEmpty) {
        await this.riskDataRepository.deleteById(riskData.id);
        return riskData.id;
      }
    }

    return riskData;
  }
}
