import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { ActionPlanBrowseFilterModel, IActionPlanBrowseRiskFilterParams } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-browse-filter.model';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { StatusEnum as PrismaStatusEnum } from '@prisma/client';

export type IActionPlanBrowseFilterModelMapper = {
  filter_status: PrismaStatusEnum[] | null;
  workspaces: { id: string; name: string }[] | null;
  filter_risk_sub_types: ({ id: number; name: string; type: RiskTypeEnum } | null)[] | null;
  filter_risk_types: (RiskTypeEnum | null)[] | null;
};

export class ActionPlanBrowseFilterModelMapper {
  static toModel(prisma: IActionPlanBrowseFilterModelMapper): ActionPlanBrowseFilterModel {
    const riskTypes = {} as IActionPlanBrowseRiskFilterParams;

    if (prisma.filter_risk_types) {
      prisma.filter_risk_types.forEach((type) => {
        if (type) riskTypes[type] = [];
      });
    }

    if (prisma.filter_risk_sub_types) {
      prisma.filter_risk_sub_types.forEach((risk) => {
        if (!risk || !risk.type) return;

        const riskType = risk.type as RiskTypeEnum;
        if (!riskTypes[riskType]) {
          riskTypes[riskType] = [];
        }
        riskTypes[riskType].push({ id: risk.id, name: risk.name });
      });
    }

    return new ActionPlanBrowseFilterModel({
      status: prisma.filter_status?.map((status) => ActionPlanStatusEnum[status]) || [],
      workspaces: prisma.workspaces || [],
      riskTypes: riskTypes,
    });
  }
}
