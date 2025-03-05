import { BadRequestException, Injectable } from '@nestjs/common';
import { IFindActionPlanUseCase } from './read-action-plan.types';
import { ActionPlanDAO } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.dao';

@Injectable()
export class ReadActionPlanUseCase {
  constructor(private readonly actionPlanDAO: ActionPlanDAO) {}

  async execute(params: IFindActionPlanUseCase.Params) {
    const data = await this.actionPlanDAO.find({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
      riskDataId: params.riskDataId,
      recommendationId: params.recommendationId,
    });

    if (!data) throw new BadRequestException('Plano de ação não encontrado');

    return data;
  }
}
