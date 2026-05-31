import { Injectable, NotFoundException } from '@nestjs/common';
import { IAssignRisksFormApplicationUseCase } from './assign-risks-form-application.types';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { formApplicationAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { resolveOperationalCompanyIdForHierarchy } from '@/@v2/forms/application/shared/helpers/resolve-operational-company-for-hierarchy.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { UpsertRiskDataService } from '@/modules/sst/services/risk-data/upsert-risk-data/upsert-risk.service';
import { HomoTypeEnum } from '@prisma/client';

@Injectable()
export class AssignRisksFormApplicationUseCase {
  constructor(
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async execute(params: IAssignRisksFormApplicationUseCase.Params) {
    const accessCompanyId = params.companyId;
    const { applicationId, risks } = params;

    const formApplication = await this.prisma.formApplication.findFirst({
      where: formApplicationAccessWhere({
        formApplicationId: applicationId,
        accessCompanyId,
      }),
    });

    if (!formApplication) {
      throw new NotFoundException('Form application not found');
    }

    await asyncBatch({
      items: risks,
      batchSize: 5,
      callback: async (risk) => {
        const operationalCompanyId = await resolveOperationalCompanyIdForHierarchy({
          prisma: this.prisma,
          formApplicationScopeService: this.formApplicationScopeService,
          formApplicationId: applicationId,
          accessCompanyId,
          hierarchyId: risk.hierarchyId,
        });

        let riskFactorGroupData = await this.prisma.riskFactorGroupData.findFirst({
          where: {
            companyId: operationalCompanyId,
          },
        });

        if (!riskFactorGroupData) {
          riskFactorGroupData = await this.prisma.riskFactorGroupData.create({
            data: {
              companyId: operationalCompanyId,
            },
          });
        }

        await this.upsertRiskDataService.execute({
          riskId: risk.riskId,
          companyId: operationalCompanyId,
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
