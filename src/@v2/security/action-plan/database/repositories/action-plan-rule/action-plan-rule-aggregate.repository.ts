import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client';
import { IActionPlanRuleAggregateRepository } from './action-plan-rule-aggregate.types';
import { Injectable } from '@nestjs/common';
import { ActionPlanRuleAggregateMapper } from '../../mappers/aggregations/action-plan-rule.mapper';

@Injectable()
export class ActionPlanRuleAggregateRepository implements IActionPlanRuleAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      hierarchies: { select: { hierarchy_id: true } },
      riskSubTypes: { select: { risk_sub_type_id: true } },
      users: { select: { user_id: true } },
    } satisfies Prisma.ActionPlanRulesFindFirstArgs['include'];

    return { include };
  }

  async findMany(params: IActionPlanRuleAggregateRepository.FindManyParams): IActionPlanRuleAggregateRepository.FindManyReturn {
    const actionPlan = await this.prisma.actionPlanRules.findMany({
      where: {
        workspace_id: params.workspaceId,
        workspace: {
          companyId: params.companyId,
        },
      },
      ...ActionPlanRuleAggregateRepository.selectOptions(),
    });

    return ActionPlanRuleAggregateMapper.toAggregates(actionPlan);
  }

  async create(params: IActionPlanRuleAggregateRepository.CreateParams): IActionPlanRuleAggregateRepository.CreateReturn {
    const actionPlan = await this.prisma.actionPlanRules.create({
      data: {
        workspace_id: params.rule.workspaceId,
        is_restriction: params.rule.isRestriction,
        is_all_hierarchies: params.rule.isAllHierarchies,
        risk_types: params.rule.riskTypes,
        hierarchies: {
          create: params.hierarchiesIds.map((id) => ({ hierarchy_id: id })),
        },
        riskSubTypes: {
          create: params.riskSubTypesIds.map((id) => ({ risk_sub_type_id: id })),
        },
        users: {
          create: params.usersIds.map((id) => ({ user_id: id })),
        },
      },
      ...ActionPlanRuleAggregateRepository.selectOptions(),
    });

    return actionPlan ? ActionPlanRuleAggregateMapper.toAggregate(actionPlan) : null;
  }

  async update(params: IActionPlanRuleAggregateRepository.UpdateParams): IActionPlanRuleAggregateRepository.UpdateReturn {
    const actionPlan = await this.prisma.actionPlanRules.update({
      where: {
        id: params.rule.id,
      },
      data: {
        is_restriction: params.rule.isRestriction,
        is_all_hierarchies: params.rule.isAllHierarchies,
        risk_types: params.rule.riskTypes,
        hierarchies: {
          deleteMany: {},
          create: params.hierarchiesIds.map((id) => ({ hierarchy_id: id })),
        },
        riskSubTypes: {
          deleteMany: {},
          create: params.riskSubTypesIds.map((id) => ({ risk_sub_type_id: id })),
        },
        users: {
          deleteMany: {},
          create: params.usersIds.map((id) => ({ user_id: id })),
        },
      },
      ...ActionPlanRuleAggregateRepository.selectOptions(),
    });

    return actionPlan ? ActionPlanRuleAggregateMapper.toAggregate(actionPlan) : null;
  }
}
