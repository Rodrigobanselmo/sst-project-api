import { Injectable } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';

import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../company/repositories/implementations/HomoGroupRepository';
import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';
import { EmployeePPPHistoryRepository } from './../../../../company/repositories/implementations/EmployeePPPHistoryRepository';

@Injectable()
export class UpsertRiskDataService {
  constructor(
    private readonly riskDataRepository: RiskDataRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(upsertRiskDataDto: UpsertRiskDataDto) {
    const keepEmpty = upsertRiskDataDto.keepEmpty;
    const workspaceId = upsertRiskDataDto.workspaceId;
    const type = upsertRiskDataDto.type;
    delete upsertRiskDataDto.keepEmpty;
    delete upsertRiskDataDto.workspaceId;
    delete upsertRiskDataDto.type;

    if ('startDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.startDate) upsertRiskDataDto.startDate = null;
    }

    if ('endDate' in upsertRiskDataDto) {
      if (!upsertRiskDataDto.endDate) upsertRiskDataDto.endDate = null;
    }
    const isTypeHierarchy = type && type == HomoTypeEnum.HIERARCHY;
    if (isTypeHierarchy)
      await hierarchyCreateHomo({
        homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId,
        companyId: upsertRiskDataDto.companyId,
        homoGroupRepository: this.homoGroupRepository,
        hierarchyRepository: this.hierarchyRepository,
        type,
        workspaceId,
      });
    const riskData = await this.riskDataRepository.upsert(upsertRiskDataDto);

    if (upsertRiskDataDto.exams) this.checkEmployeeExamService.execute({ homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId });

    this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: upsertRiskDataDto.companyId,
          hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: upsertRiskDataDto.homogeneousGroupId } } } } },
        },
      },
    });

    if (!keepEmpty) {
      const isEmpty =
        riskData.adms.length === 0 &&
        riskData.recs.length === 0 &&
        riskData.engs.length === 0 &&
        riskData.epis.length === 0 &&
        riskData.exams.length === 0 &&
        riskData.generateSources.length === 0 &&
        !riskData.endDate &&
        !riskData.startDate &&
        !riskData.probability;

      if (isEmpty) {
        await this.riskDataRepository.deleteById(riskData.id);
        return riskData.id;
      }
    }

    return riskData;
  }
}

export const hierarchyCreateHomo = async ({
  homoGroupRepository,
  hierarchyRepository,
  type = 'HIERARCHY',
  workspaceId,
  homogeneousGroupId,
  companyId,
}: {
  homoGroupRepository: HomoGroupRepository;
  hierarchyRepository: HierarchyRepository;
  type?: 'HIERARCHY';
  workspaceId?: string;
  homogeneousGroupId: string;
  companyId: string;
}) => {
  const homo = await homoGroupRepository.findHomoGroupByCompanyAndId(homogeneousGroupId, companyId);

  if (!homo?.id) {
    const hierarchy = await hierarchyRepository.findAllHierarchyByCompanyAndId(homogeneousGroupId, companyId);

    if (hierarchy?.id) {
      const gho = await homoGroupRepository.create(
        {
          companyId: companyId,
          description: '',
          name: hierarchy.id,
          type: type,
          id: hierarchy.id,
        },
        companyId,
      );

      await hierarchyRepository.upsertMany(
        [
          {
            ghoName: gho.name,
            companyId: companyId,
            id: hierarchy.id,
            name: hierarchy.name,
            status: hierarchy.status,
            type: hierarchy.type,
            workspaceIds: workspaceId ? [workspaceId] : hierarchy.workspaceIds || hierarchy?.workspaces?.map((w) => w?.id) || [],
          },
        ],
        companyId,
      );
    }
  }
};
