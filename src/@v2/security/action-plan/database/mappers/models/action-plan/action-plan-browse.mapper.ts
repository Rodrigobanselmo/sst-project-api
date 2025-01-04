import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { ActionPlanBrowseFilterModelMapper, IActionPlanBrowseFilterModelMapper } from './action-plan-browse-filter.mapper';
import { ActionPlanBrowseResultModelMapper, IActionPlanBrowseResultModelMapper } from './action-plan-browse-result.mapper';
import { ActionPlanBrowseModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-browse.model';

export type IActionPlanBrowseModelMapper = {
  results: IActionPlanBrowseResultModelMapper[]
  pagination: IPaginationModelMapper
  filters: IActionPlanBrowseFilterModelMapper
}

export class ActionPlanBrowseModelMapper {
  static toModel(prisma: IActionPlanBrowseModelMapper): ActionPlanBrowseModel {
    return new ActionPlanBrowseModel({
      results: ActionPlanBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: ActionPlanBrowseFilterModelMapper.toModel(prisma.filters),
    })
  }
}
