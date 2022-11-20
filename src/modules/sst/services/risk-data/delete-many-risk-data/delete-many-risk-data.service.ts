import { Injectable } from '@nestjs/common';

import { DeleteManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class DeleteManyRiskDataService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(upsertRiskDataDto: DeleteManyRiskDataDto, companyId: string) {
    const deletedCount = await this.riskDataRepository.deleteByIdsAndCompany(upsertRiskDataDto.ids, companyId);
    // const deletedCount = await this.riskDataRepository.deleteByHomoAndRisk(upsertRiskDataDto.homogeneousGroupIds, upsertRiskDataDto.riskIds, groupId);

    return deletedCount;
  }
}
