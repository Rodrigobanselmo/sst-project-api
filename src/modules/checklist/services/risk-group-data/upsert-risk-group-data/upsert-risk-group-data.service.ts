import { Injectable } from '@nestjs/common';

import { UpsertRiskGroupDataDto } from '../../../dto/risk-group-data.dto';
import { RiskGroupDataRepository } from '../../../repositories/implementations/RiskGroupDataRepository';

@Injectable()
export class UpsertRiskGroupDataService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
  ) {}

  async execute(upsertRiskDataDto: UpsertRiskGroupDataDto) {
    const riskData = await this.riskGroupDataRepository.upsert(
      upsertRiskDataDto,
    );

    return riskData;
  }
}
