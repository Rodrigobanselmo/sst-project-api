import { Injectable } from '@nestjs/common';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class FindAllByHomogeneousGroupService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(homogeneousGroupId: string, groupId: string, companyId: string) {
    const riskData = await this.riskDataRepository.findAllByHomogeneousGroupId(companyId, groupId, homogeneousGroupId);

    return riskData;
  }
}
