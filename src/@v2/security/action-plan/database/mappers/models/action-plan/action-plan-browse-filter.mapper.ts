import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { ActionPlanBrowseFilterModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-browse-filter.model';
import { StatusEnum as PrismaStatusEnum } from '@prisma/client';

export type IActionPlanBrowseFilterModelMapper = {
  filter_status: PrismaStatusEnum[] | null;
  workspaces: { id: string; name: string }[] | null;
};

export class ActionPlanBrowseFilterModelMapper {
  static toModel(prisma: IActionPlanBrowseFilterModelMapper): ActionPlanBrowseFilterModel {
    return new ActionPlanBrowseFilterModel({
      status: prisma.filter_status?.map((status) => ActionPlanStatusEnum[status]) || [],
      workspaces: prisma.workspaces || [],
    });
  }
}
