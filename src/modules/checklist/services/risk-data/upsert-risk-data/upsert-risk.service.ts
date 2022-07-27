import { HierarchyRepository } from './../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './../../../../company/repositories/implementations/HomoGroupRepository';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';

import { UpsertRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class UpsertRiskDataService {
  constructor(
    private readonly riskDataRepository: RiskDataRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}

  async execute(upsertRiskDataDto: UpsertRiskDataDto) {
    const keepEmpty = upsertRiskDataDto.keepEmpty;
    const workspaceId = upsertRiskDataDto.workspaceId;
    const type = upsertRiskDataDto.type;
    delete upsertRiskDataDto.keepEmpty;
    delete upsertRiskDataDto.workspaceId;
    delete upsertRiskDataDto.type;

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

    if (!keepEmpty) {
      const isEmpty =
        riskData.adms.length === 0 &&
        riskData.recs.length === 0 &&
        riskData.engs.length === 0 &&
        riskData.epis.length === 0 &&
        riskData.generateSources.length === 0 &&
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
  type,
  workspaceId,
  homogeneousGroupId,
  companyId,
}: {
  homoGroupRepository: HomoGroupRepository;
  hierarchyRepository: HierarchyRepository;
  type: 'HIERARCHY';
  workspaceId: string;
  homogeneousGroupId: string;
  companyId: string;
}) => {
  const homo = await homoGroupRepository.findHomoGroupByCompanyAndId(
    homogeneousGroupId,
    companyId,
  );

  if (!homo?.id) {
    const hierarchy = await hierarchyRepository.findAllHierarchyByCompanyAndId(
      homogeneousGroupId,
      companyId,
    );

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
            workspaceIds: workspaceId
              ? [workspaceId]
              : hierarchy.workspaceIds || [],
          },
        ],
        companyId,
      );
    }
  }
};
