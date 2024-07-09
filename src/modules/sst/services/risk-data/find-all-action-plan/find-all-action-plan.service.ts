import { FindRiskDataDto } from '../../../dto/risk-data.dto';
import { Injectable } from '@nestjs/common';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class FindAllActionPlanService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(groupId: string, workspaceId: string, companyId: string, { skip, take, ...query }: FindRiskDataDto) {
    const riskData = await this.riskDataRepository.findAllActionPlan(groupId, workspaceId, companyId, query, {
      skip,
      take,
    });

    return riskData;
  }
}
