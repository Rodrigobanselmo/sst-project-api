import { BrowseActionPlanUseCase } from '@/@v2/security/action-plan/application/action-plan/browse-action-plan/use-cases/browse-action-plan.usecase';
import { ActionPlanOrderByEnum } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.types';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { ExcelProvider } from '@/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { Injectable } from '@nestjs/common';
import {
  ACTION_PLAN_EXPORT_HEADERS,
  mapActionPlanToExportRow,
} from '../utils/action-plan-export-rows.util';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';
import { IExportActionPlanUseCase } from './export-action-plan.types';

const DEFAULT_EXPORT_ORDER = [
  { field: ActionPlanOrderByEnum.STATUS, order: OrderByDirectionEnum.ASC },
  { field: ActionPlanOrderByEnum.LEVEL, order: OrderByDirectionEnum.DESC },
  { field: ActionPlanOrderByEnum.EXPOSED_WORKERS, order: OrderByDirectionEnum.DESC },
  { field: ActionPlanOrderByEnum.ORIGIN, order: OrderByDirectionEnum.ASC },
];

const EXPORT_LIMIT = 50_000;

@Injectable()
export class ExportActionPlanUseCase {
  constructor(
    private readonly browseActionPlanUseCase: BrowseActionPlanUseCase,
    private readonly excelProvider: ExcelProvider,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: IExportActionPlanUseCase.Params) {
    const browse = await this.browseActionPlanUseCase.execute({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
      search: params.search,
      orderBy: params.orderBy?.length ? params.orderBy : DEFAULT_EXPORT_ORDER,
      status: params.status,
      responsibleIds: params.responsibleIds,
      occupationalRisks: params.occupationalRisks,
      isExpired: params.isExpired,
      hierarchyIds: params.hierarchyIds,
      recommendationIds: params.recommendationIds,
      generateSourceIds: params.generateSourceIds,
      riskIds: params.riskIds,
      riskTypes: params.riskTypes,
      riskSubTypes: params.riskSubTypes,
      pagination: { page: 1, limit: EXPORT_LIMIT },
    });

    const rows = browse.results.map(mapActionPlanToExportRow);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: params.workspaceId, companyId: params.companyId },
      select: { name: true, abbreviation: true },
    });

    const workspaceLabel = (workspace?.abbreviation || workspace?.name || 'estabelecimento')
      .replace(/[^\w\-]+/g, '_')
      .slice(0, 40);

    const filename = `plano-de-acao_${workspaceLabel}_${dateUtils().format('YYYY-MM-DD')}`;

    return this.excelProvider.createReportTable(
      [{ name: 'Plano de Ação', rows: [ACTION_PLAN_EXPORT_HEADERS, ...rows] }],
      filename,
    );
  }
}
