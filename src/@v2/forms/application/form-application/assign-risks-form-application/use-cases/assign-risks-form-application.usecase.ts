import { Injectable, NotFoundException } from '@nestjs/common';
import { IAssignRisksFormApplicationUseCase } from './assign-risks-form-application.types';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { UpsertRiskDataService } from '@/modules/sst/services/risk-data/upsert-risk-data/upsert-risk.service';
import { HomoTypeEnum } from '@prisma/client';

@Injectable()
export class AssignRisksFormApplicationUseCase {
  constructor(
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: IAssignRisksFormApplicationUseCase.Params) {
    const { companyId, applicationId, risks } = params;

    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: applicationId,
        company_id: companyId,
      },
    });

    if (!formApplication) {
      throw new NotFoundException('Form application not found');
    }

    const riskFactorGroupData = await this.prisma.riskFactorGroupData.findFirst({
      where: {
        companyId: companyId,
      },
    });

    if (!riskFactorGroupData) {
      throw new NotFoundException('Risk factor group data not found');
    }

    await asyncBatch({
      items: risks,
      batchSize: 5,
      callback: async (risk) => {
        await this.upsertRiskDataService.execute({
          riskId: risk.riskId,
          companyId: companyId,
          riskFactorGroupDataId: riskFactorGroupData.id,
          homogeneousGroupId: risk.hierarchyId,
          probability: risk.probability,
          type: HomoTypeEnum.HIERARCHY,
        });

        await this.prisma.formApplicationRiskLog.create({
          data: {
            form_application_id: formApplication.id,
            risk_id: risk.riskId,
            entity_id: risk.hierarchyId,
            probability: risk.probability,
          },
        });
      },
    });

    return {
      success: true,
      message: 'Risks assigned successfully',
    };
  }
}
