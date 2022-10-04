import { Injectable } from '@nestjs/common';
import clone from 'clone';

import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskFactorDataEntity } from './../../../entities/riskData.entity';

@Injectable()
export class FindAllByHierarchyService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(hierarchyId: string, companyId: string) {
    const risks = await this.riskRepository.findNude({
      where: {
        representAll: false, // remove standard risk
        riskFactorData: {
          some: {
            companyId,
            homogeneousGroup: {
              hierarchyOnHomogeneous: { some: { hierarchyId } },
            },
          },
        },
      },
      select: {
        name: true,
        severity: true,
        type: true,
        representAll: true,
        id: true,
        isPGR: true,
        isAso: true,
        isPPP: true,
        isPCMSO: true,
        docInfo: {
          where: {
            AND: [
              {
                OR: [
                  { companyId },
                  {
                    company: {
                      applyingServiceContracts: {
                        some: { receivingServiceCompanyId: companyId },
                      },
                    },
                  },
                ],
              },
              { OR: [{ hierarchyId }, { hierarchyId: null }] },
            ],
          },
        },
        examToRisk: {
          include: { exam: { select: { name: true, id: true } } },
          where: { companyId },
        },
        riskFactorData: {
          where: {
            companyId,
            homogeneousGroup: {
              hierarchyOnHomogeneous: { some: { hierarchyId } },
            },
          },
          include: {
            examsToRiskFactorData: {
              include: {
                exam: { select: { name: true, status: true } },
              },
            },
            homogeneousGroup: {
              include: {
                characterization: { select: { name: true, type: true } },
                environment: { select: { name: true, type: true } },
              },
            },
          },
        },
      },
    });

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
