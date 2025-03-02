import { Injectable } from '@nestjs/common';
import { IFindOriginUseCase } from './find-origin.types';
import { OriginDAO } from '@/@v2/security/action-plan/database/dao/origin/origin.dao';

@Injectable()
export class ReadOriginUseCase {
  constructor(private readonly originDAO: OriginDAO) {}

  async execute(params: IFindOriginUseCase.Params) {
    const data = await this.originDAO.find({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
      id: params.id,
      recommendationId: params.recommendationId,
    });

    return data;
  }
}
