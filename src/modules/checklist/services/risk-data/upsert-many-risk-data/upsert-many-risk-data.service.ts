import { Injectable } from '@nestjs/common';

import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class UpsertManyRiskDataService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(upsertRiskDataDto: UpsertManyRiskDataDto) {
    const risksDataMany =
      (await Promise.all(
        upsertRiskDataDto.riskIds.map(
          async (riskId) =>
            await this.riskDataRepository.upsertMany({
              ...upsertRiskDataDto,
              riskId,
            }),
        ),
      )) || [];

    if (upsertRiskDataDto.riskId)
      risksDataMany.push(
        await this.riskDataRepository.upsertMany(upsertRiskDataDto),
      );

    return risksDataMany;
  }
}
