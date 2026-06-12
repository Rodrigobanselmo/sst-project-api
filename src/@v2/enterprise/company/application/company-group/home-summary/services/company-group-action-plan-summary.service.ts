import { Inject, Injectable } from '@nestjs/common';

import { ActionPlanDAO } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.dao';
import { ActionPlanInfoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-info/action-plan-aggregate.repository';
import { ActionPlanRuleAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-rule/action-plan-rule-aggregate.repository';
import { ActionPlanRulesDomainService } from '@/@v2/security/action-plan/domain/services/action-plan-rules.ds';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { PrismaService } from '@/prisma/prisma.service';

export type CompanyGroupActionPlanCompanySummary = {
  companyId: string;
  companyName: string | null;
  companyFantasy: string | null;
  companyInitials: string | null;
  total: number;
  pending: number;
  started: number;
  done: number;
  canceled: number;
};

export type CompanyGroupActionPlanSummary = {
  status: 'available';
  total: number;
  pending: number;
  started: number;
  done: number;
  canceled: number;
  companies: CompanyGroupActionPlanCompanySummary[];
};

const emptyCounts = () => ({
  total: 0,
  pending: 0,
  progress: 0,
  done: 0,
  canceled: 0,
});

@Injectable()
export class CompanyGroupActionPlanSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionPlanDAO: ActionPlanDAO,
    private readonly actionPlanRuleAggregateRepository: ActionPlanRuleAggregateRepository,
    private readonly actionPlanInfoAggregateRepository: ActionPlanInfoAggregateRepository,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
  ) {}

  async aggregate(
    includedCompanyIds: string[],
  ): Promise<CompanyGroupActionPlanSummary> {
    if (!includedCompanyIds.length) {
      return {
        status: 'available',
        total: 0,
        pending: 0,
        started: 0,
        done: 0,
        canceled: 0,
        companies: [],
      };
    }

    const loggedUser = this.context.get<UserContext>(ContextKey.USER);
    if (!loggedUser.id) {
      throw new Error('Usuário não encontrado no contexto');
    }

    const companies = await this.prisma.company.findMany({
      where: { id: { in: includedCompanyIds }, deleted_at: null },
      select: {
        id: true,
        name: true,
        fantasy: true,
        initials: true,
        workspace: {
          where: { deleted_at: null },
          select: { id: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const companySummaries = await Promise.all(
      companies.map(async (company) => {
        const workspaceCounts = await Promise.all(
          company.workspace.map(async (workspace) => {
            const [actionPlanInfo, actionPlanRules] = await Promise.all([
              this.actionPlanInfoAggregateRepository.findById({
                companyId: company.id,
                workspaceId: workspace.id,
              }),
              this.actionPlanRuleAggregateRepository.findMany({
                companyId: company.id,
                workspaceId: workspace.id,
              }),
            ]);

            const rules = ActionPlanRulesDomainService.resolveUserPermissions({
              userId: loggedUser.id,
              actionPlanRules,
              actionPlanInfo,
            });

            return this.actionPlanDAO.countHomeSummary({
              companyId: company.id,
              workspaceIds: [workspace.id],
              rules,
            });
          }),
        );

        const totals = workspaceCounts.reduce(
          (acc, counts) => ({
            total: acc.total + counts.total,
            pending: acc.pending + counts.pending,
            progress: acc.progress + counts.progress,
            done: acc.done + counts.done,
            canceled: acc.canceled + counts.canceled,
          }),
          emptyCounts(),
        );

        return {
          companyId: company.id,
          companyName: company.name,
          companyFantasy: company.fantasy,
          companyInitials: company.initials,
          total: totals.total,
          pending: totals.pending,
          started: totals.progress,
          done: totals.done,
          canceled: totals.canceled,
        };
      }),
    );

    const companiesWithActions = companySummaries.filter(
      (company) => company.total > 0,
    );

    const consolidated = companiesWithActions.reduce(
      (acc, company) => ({
        total: acc.total + company.total,
        pending: acc.pending + company.pending,
        started: acc.started + company.started,
        done: acc.done + company.done,
        canceled: acc.canceled + company.canceled,
      }),
      {
        total: 0,
        pending: 0,
        started: 0,
        done: 0,
        canceled: 0,
      },
    );

    return {
      status: 'available',
      ...consolidated,
      companies: companiesWithActions,
    };
  }
}
