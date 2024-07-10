import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskDocInfoEntity } from '../../../entities/riskDocInfo.entity';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertRiskDocInfoDto } from '../../../dto/risk-doc-info.dto';
import { RiskDocInfoRepository } from '../../../repositories/implementations/RiskDocInfoRepository';

@Injectable()
export class UpsertRiskDocInfoService {
  constructor(
    private readonly riskDocInfoRepository: RiskDocInfoRepository,
    private readonly riskRepository: RiskRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
  ) {}

  async execute(upsertRiskDataDto: UpsertRiskDocInfoDto, user: UserPayloadDto) {
    if (user.isMaster && user.targetCompanyId === user.companyId) {
      const risk = await this.riskRepository.update(
        {
          companyId: user.targetCompanyId,
          id: upsertRiskDataDto.riskId,
          isAso: upsertRiskDataDto.isAso,
          isPGR: upsertRiskDataDto.isPGR,
          isPPP: upsertRiskDataDto.isPPP,
          isPCMSO: upsertRiskDataDto.isPCMSO,
        },
        true,
        user.targetCompanyId,
      );

      if (upsertRiskDataDto.isPPP)
        this.employeePPPHistoryRepository.updateManyNude({
          data: { sendEvent: true },
          where: {
            employee: {
              hierarchy: {
                hierarchyOnHomogeneous: {
                  some: { homogeneousGroup: { riskFactorData: { some: { riskId: upsertRiskDataDto.riskId } } } },
                },
              },
            },
          },
        });

      return risk;
    }

    const riskDocInfo = upsertRiskDataDto.hierarchyId
      ? ({} as RiskDocInfoEntity)
      : await this.riskDocInfoRepository.findFirstNude({
          where: {
            companyId: user.targetCompanyId,
            riskId: upsertRiskDataDto.riskId,
          },
        });

    const data = await this.riskDocInfoRepository.upsert({
      ...upsertRiskDataDto,
      companyId: user.targetCompanyId,
      id: riskDocInfo?.id,
    });

    if (upsertRiskDataDto.isPPP)
      this.employeePPPHistoryRepository.updateManyNude({
        data: { sendEvent: true },
        where: {
          employee: {
            companyId: user.targetCompanyId,
            hierarchy: {
              hierarchyOnHomogeneous: {
                some: { homogeneousGroup: { riskFactorData: { some: { riskId: upsertRiskDataDto.riskId } } } },
              },
            },
          },
        },
      });

    return data;
  }
}
