import { Injectable } from '@nestjs/common';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class FindAllByGroupAndRiskService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(riskId: string, groupId: string, companyId: string) {
    console.log(companyId, groupId, riskId, companyId);
    const riskData = await this.riskDataRepository.findAllByGroupAndRisk(
      groupId,
      riskId,
      companyId,
    );

    return riskData;
  }
}
