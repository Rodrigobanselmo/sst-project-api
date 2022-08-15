import { Injectable } from '@nestjs/common';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class FindAllByHierarchyService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(hierarchyId: string, groupId: string, companyId: string) {
    const riskData = await this.riskDataRepository.findAllByHierarchyId(
      companyId,
      groupId,
      hierarchyId,
    );

    return riskData;
  }
}
