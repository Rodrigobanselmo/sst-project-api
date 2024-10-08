import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';

import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { hierarchyCreateHomo } from '../upsert-risk-data/upsert-risk.service';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class UpsertManyRiskDataService {
  constructor(
    private readonly riskDataRepository: RiskDataRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(upsertRiskDataDto: UpsertManyRiskDataDto) {
    (await Promise.all(
      upsertRiskDataDto.homogeneousGroupIds.map(async (homogeneousGroupId, index) => {
        const workspaceId = upsertRiskDataDto.workspaceIds
          ? upsertRiskDataDto.workspaceIds[index]
          : upsertRiskDataDto.workspaceId;

        const type = upsertRiskDataDto.type;

        const isTypeHierarchy = type && type == HomoTypeEnum.HIERARCHY;
        if (isTypeHierarchy) {
          await hierarchyCreateHomo({
            homogeneousGroupId: homogeneousGroupId,
            companyId: upsertRiskDataDto.companyId,
            homoGroupRepository: this.homoGroupRepository,
            hierarchyRepository: this.hierarchyRepository,
            type,
            workspaceId,
          });
        }
      }),
    )) || [];

    delete upsertRiskDataDto.workspaceIds;
    delete upsertRiskDataDto.workspaceId;
    delete upsertRiskDataDto.type;

    if ('startDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.startDate) upsertRiskDataDto.startDate = null;
    }

    if ('endDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.endDate) upsertRiskDataDto.endDate = null;
    }

    const risksDataMany =
      (await Promise.all(
        upsertRiskDataDto.riskIds.map(async (riskId) => {
          return await this.riskDataRepository.upsertConnectMany({
            ...upsertRiskDataDto,
            riskId,
          });
        }),
      )) || [];

    if (upsertRiskDataDto.riskId) risksDataMany.push(await this.riskDataRepository.upsertMany(upsertRiskDataDto));

    if (upsertRiskDataDto.exams)
      this.checkEmployeeExamService.execute({
        homogeneousGroupIds: upsertRiskDataDto.homogeneousGroupIds,
        companyId: upsertRiskDataDto.companyId,
      });

    this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: upsertRiskDataDto.companyId,
          hierarchyHistory: {
            some: {
              hierarchy: {
                hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: upsertRiskDataDto.homogeneousGroupIds } } },
              },
            },
          },
        },
      },
    });

    // const emptyRiskDataIds = risksDataMany.reduce((acc, riskDataSlice) => {
    //   return [
    //     ...acc,
    //     ...riskDataSlice
    //       .map((riskData) => {
    //         const isEmpty =
    //           riskData.adms.length === 0 &&
    //           riskData.recs.length === 0 &&
    //           riskData.engs.length === 0 &&
    //           riskData.epis.length === 0 &&
    //           riskData.generateSources.length === 0 &&
    //           !riskData.probability;

    //         if (isEmpty) {
    //           return riskData.id;
    //         }
    //         return;
    //       })
    //       .filter((id) => id),
    //   ];
    // }, [] as string[]);

    // await this.riskDataRepository.deleteByIds(emptyRiskDataIds);

    return risksDataMany;
  }
}
