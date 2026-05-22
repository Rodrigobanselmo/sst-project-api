import { Controller, HttpStatus, Param, Post, Res, UseGuards, Body } from '@nestjs/common';
import { Response } from 'express';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ExportActionPlanUseCase } from '../use-cases/export-action-plan.usecase';
import { ExportActionPlanPath } from './export-action-plan.path';
import { ExportActionPlanBody } from './export-action-plan.body';

@Controller(ActionPlanRoutes.ACTION_PLAN.BROWSE)
@UseGuards(JwtAuthGuard)
export class ExportActionPlanController {
  constructor(private readonly exportActionPlanUseCase: ExportActionPlanUseCase) {}

  @Post('export')
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async export(
    @Param() path: ExportActionPlanPath,
    @Body() body: ExportActionPlanBody,
    @Res() res: Response,
  ) {
    const data = await this.exportActionPlanUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      orderBy: body.orderBy,
      search: body.search,
      status: body.status,
      responsibleIds: body.responsibleIds,
      occupationalRisks: body.occupationalRisks,
      generateSourceIds: body.generateSourceIds,
      hierarchyIds: body.hierarchyIds,
      recommendationIds: body.recommendationIds,
      riskIds: body.riskIds,
      isExpired: body.isExpired || undefined,
      riskSubTypes: body.riskSubTypes,
      riskTypes: body.riskTypes,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${data.filename}"`);
    res.status(HttpStatus.OK);

    await data.workbook.xlsx.write(res);
    res.end();
  }
}
