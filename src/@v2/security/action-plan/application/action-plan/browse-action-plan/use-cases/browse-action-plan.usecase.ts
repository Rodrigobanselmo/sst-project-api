import { Inject, Injectable } from '@nestjs/common';
import { IBrowseActionPlanUseCase } from './browse-action-plan.types';
import { ActionPlanDAO } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.dao';
import { ActionPlanRuleAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-rule/action-plan-rule-aggregate.repository';
import { ActionPlanRulesDomainService } from '@/@v2/security/action-plan/domain/services/action-plan-rules.ds';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { ActionPlanInfoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-info/action-plan-aggregate.repository';

@Injectable()
export class BrowseActionPlanUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly actionPlanDAO: ActionPlanDAO,
    private readonly actionPlanRuleAggregateRepository: ActionPlanRuleAggregateRepository,
    private readonly actionPlanInfoAggregateRepository: ActionPlanInfoAggregateRepository,
  ) {}

  async execute(params: IBrowseActionPlanUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);
    if (!loggedUser.id) throw new Error('Usuário não encontrado no contexto');

    const actionPlanInfoPromise = this.actionPlanInfoAggregateRepository.findById({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
    });

    const actionPlanRulesPromise = this.actionPlanRuleAggregateRepository.findMany({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
    });

    const [actionPlanInfo, actionPlanRules] = await Promise.all([actionPlanInfoPromise, actionPlanRulesPromise]);

    const ruleVO = ActionPlanRulesDomainService.resolveUserPermissions({
      userId: loggedUser.id,
      actionPlanRules,
      actionPlanInfo,
    });

    const data = await this.actionPlanDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        occupationalRisks: params.occupationalRisks,
        responsibleIds: params.responsibleIds,
        status: params.status,
        workspaceIds: [params.workspaceId],
        search: params.search,
        generateSourceIds: params.generateSourceIds,
        hierarchyIds: params.hierarchyIds,
        recommendationIds: params.recommendationIds,
        riskIds: params.riskIds,
        riskSubTypes: params.riskSubTypes,
        riskTypes: params.riskTypes,
        isExpired: params.isExpired,
        rules: ruleVO,
      },
    });

    return data;
  }
}
