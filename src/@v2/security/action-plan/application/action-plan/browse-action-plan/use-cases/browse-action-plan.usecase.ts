import { Inject, Injectable } from '@nestjs/common';
import { IBrowseActionPlanUseCase } from './browse-action-plan.types';
import { ActionPlanDAO } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.dao';
import { ActionPlanRuleAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-rule/action-plan-rule-aggregate.repository';
import { ActionPlanRulesDomainService } from '@/@v2/security/action-plan/domain/services/action-plan-rules.ds';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';

@Injectable()
export class BrowseActionPlanUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly actionplanDAO: ActionPlanDAO,
    private readonly actionPlanRuleAggregateRepository: ActionPlanRuleAggregateRepository,
  ) {}

  async execute(params: IBrowseActionPlanUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);
    if (!loggedUser.id) throw new Error('Usuário não encontrado no contexto');

    const rules = await this.actionPlanRuleAggregateRepository.findMany({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
    });

    const ruleVO = ActionPlanRulesDomainService.resolveUserPermissions({
      rules,
      userId: loggedUser.id,
    });

    const data = await this.actionplanDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        ocupationalRisks: params.ocupationalRisks,
        responisbleIds: params.responisbleIds,
        status: params.status,
        workspaceIds: [params.workspaceId],
        search: params.search,
        generateSourceIds: params.generateSourceIds,
        hierarchyIds: params.hierarchyIds,
        recommendationIds: params.recommendationIds,
        riskIds: params.riskIds,
        isExpired: params.isExpired,
        rules: ruleVO,
      },
    });

    return data;
  }
}
