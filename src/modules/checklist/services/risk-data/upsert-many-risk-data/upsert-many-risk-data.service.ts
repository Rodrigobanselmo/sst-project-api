import { Injectable } from '@nestjs/common';

import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class UpsertManyRiskDataService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(upsertRiskDataDto: UpsertManyRiskDataDto) {
    const risksDataMany = await this.riskDataRepository.upsertMany(
      upsertRiskDataDto,
    );

    const riskData = risksDataMany[0];
    const riskDataIds = risksDataMany.map((risk) => risk.id);

    if (riskData) {
      const isEmpty =
        riskData.adms.length === 0 &&
        riskData.recs.length === 0 &&
        riskData.engs.length === 0 &&
        riskData.epis.length === 0 &&
        riskData.generateSources.length === 0 &&
        !riskData.probability;

      if (isEmpty) {
        await this.riskDataRepository.deleteByIds(riskDataIds);
        return riskDataIds;
      }
    }

    return risksDataMany;
  }
}
