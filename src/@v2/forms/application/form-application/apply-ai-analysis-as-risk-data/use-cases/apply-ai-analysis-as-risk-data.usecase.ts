import { formApplicationAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { resolveOperationalCompanyIdForHierarchy } from '@/@v2/forms/application/shared/helpers/resolve-operational-company-for-hierarchy.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { UpsertRiskDataService } from '@/modules/sst/services/risk-data/upsert-risk-data/upsert-risk.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';
import { IApplyAiAnalysisAsRiskDataUseCase } from './apply-ai-analysis-as-risk-data.types';

@Injectable()
export class ApplyAiAnalysisAsRiskDataUseCase {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
    private readonly upsertRiskDataService: UpsertRiskDataService,
  ) {}

  async execute(
    params: IApplyAiAnalysisAsRiskDataUseCase.Params,
  ): Promise<IApplyAiAnalysisAsRiskDataUseCase.Result> {
    const accessCompanyId = params.accessCompanyId;
    const applicationId = params.applicationId;

    const formApplication = await this.prisma.formApplication.findFirst({
      where: formApplicationAccessWhere({
        formApplicationId: applicationId,
        accessCompanyId,
      }),
    });

    if (!formApplication) {
      throw new NotFoundException('Form application not found');
    }

    const operationalCompanyId = await resolveOperationalCompanyIdForHierarchy({
      prisma: this.prisma,
      formApplicationScopeService: this.formApplicationScopeService,
      formApplicationId: applicationId,
      accessCompanyId,
      hierarchyId: params.hierarchyId,
    });

    const riskFactorGroupData = await this.prisma.riskFactorGroupData.findFirst({
      where: { companyId: operationalCompanyId },
    });

    if (!riskFactorGroupData) {
      throw new NotFoundException('Risk factor group data not found');
    }

    const mapRecMed = (items?: IApplyAiAnalysisAsRiskDataUseCase.RecMedItem[]) =>
      items?.map((item) => ({
        ...item,
        companyId: operationalCompanyId,
      }));

    const riskData = await this.upsertRiskDataService.execute({
      companyId: operationalCompanyId,
      riskId: params.riskId,
      riskFactorGroupDataId: riskFactorGroupData.id,
      homogeneousGroupId: params.hierarchyId,
      hierarchyId: params.hierarchyId,
      type: HomoTypeEnum.HIERARCHY,
      keepEmpty: true,
      probability: params.probability,
      generateSourcesAddOnly: params.generateSourcesAddOnly?.map((source) => ({
        name: source.name,
        companyId: operationalCompanyId,
      })),
      engsAddOnly: mapRecMed(params.engsAddOnly),
      recAddOnly: mapRecMed(params.recAddOnly),
      admsAddOnly: mapRecMed(params.admsAddOnly),
    });

    const riskFactorDataId =
      typeof riskData === 'string' ? riskData : riskData?.id;

    return {
      success: true,
      operationalCompanyId,
      riskFactorDataId,
    };
  }
}
