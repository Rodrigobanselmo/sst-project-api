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
      {
        include: {
          riskFactor: {
            select: { name: true, severity: true, type: true, id: true },
          },
          homogeneousGroup: {
            include: {
              characterization: { select: { name: true, type: true } },
              environment: { select: { name: true, type: true } },
            },
          },
          generateSources: false,
          adms: false,
          recs: false,
          dataRecs: false,
          engsToRiskFactorData: false,
          epiToRiskFactorData: false,
        },
      },
    );

    return riskData;
  }
}
