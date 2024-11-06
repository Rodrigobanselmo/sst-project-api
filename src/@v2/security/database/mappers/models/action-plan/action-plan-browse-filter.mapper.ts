import { ActionPlanBrowseFilterModel } from '@/@v2/security/domain/models/action-plan/action-plan-browse-filter.model';
import { CharacterizationTypeEnum as PrismaCharacterizationTypeEnum, Status as PrismaStatus } from '@prisma/client';

export type IActionPlanBrowseFilterModelMapper = {
  filter_types: PrismaCharacterizationTypeEnum[] | null;
  stages: (PrismaStatus | null)[] | null;
}

export class ActionPlanBrowseFilterModelMapper {
  static toModel(prisma: IActionPlanBrowseFilterModelMapper): ActionPlanBrowseFilterModel {
    return {} as any
    // return new ActionPlanBrowseFilterModel({
    //   types: prisma.filter_types?.map((type) => CharacterizationTypeEnum[type]) || [],
    //   stages: prisma.stages?.map((stage) => {
    //     if (!stage) return {
    //       id: 0,
    //       name: 'Sem Status',
    //       color: undefined,
    //     }

    //     return {
    //       id: stage.id,
    //       name: stage.name,
    //       color: stage.color || undefined,
    //     }
    //   }) || [],
    // })
  }
}
