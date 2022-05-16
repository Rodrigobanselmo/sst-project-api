import { Injectable } from '@nestjs/common';
import { Document } from 'docx';
import { RiskGroupDataRepository } from 'src/modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';

import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { actionPlanTableSection } from '../../utils/sections/tables/actionPlan/actionPlan.section';
import { riskInventoryTableSection } from '../../utils/sections/tables/riskInventory/riskInventory.section';

@Injectable()
export class PgrDownloadService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}

  async execute(userPayloadDto: UserPayloadDto, riskGroupId: string) {
    const companyId = userPayloadDto.targetCompanyId;

    const riskGroupData = await this.riskGroupDataRepository.findById(
      riskGroupId,
      companyId,
    );

    const hierarchyData =
      await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
        include: { employees: true, workplace: true, homogeneousGroups: true },
      });

    const doc = new Document({
      sections: [
        actionPlanTableSection(riskGroupData),
        ...riskInventoryTableSection(riskGroupData, hierarchyData),
      ],
    });

    return doc;
  }
}
