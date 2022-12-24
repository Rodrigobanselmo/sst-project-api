import { Injectable } from '@nestjs/common';
import clone from 'clone';

import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskFactorDataEntity } from '../../../entities/riskData.entity';

@Injectable()
export class FindAllByHierarchyService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(hierarchyId: string, companyId: string) {
    const risks = await this.riskRepository.findRiskDataByHierarchies([hierarchyId], companyId);
    const riskDataReturn: RiskFactorDataEntity[] = [];

    risks.forEach((risk) => {
      risk.riskFactorData.forEach((riskData) => {
        const riskCopy = clone(risk);
        riskCopy.riskFactorData = undefined;

        riskData.riskFactor = riskCopy;
        riskDataReturn.push(riskData);
      });
    });

    return riskDataReturn.map((riskData) => new RiskFactorDataEntity(riskData));
  }
}
