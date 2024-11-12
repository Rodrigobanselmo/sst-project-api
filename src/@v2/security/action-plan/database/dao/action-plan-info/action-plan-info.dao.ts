import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import { ActionPlanInfoModelMapper } from '../../mappers/models/action-plan-info/action-plan-info-find.mapper';
import { IActionPlanInfoDAO } from './action-plan-info.types';


@Injectable()
export class ActionPlanInfoDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async find({ companyId, workspaceId }: IActionPlanInfoDAO.FindParams) {
    const data = await this.prisma.documentData.findFirst({
      where: {
        companyId,
        workspaceId,
        type: DocumentTypeEnum.PGR,
      },
      include: {
        coordinator: true,
      }
    })

    return ActionPlanInfoModelMapper.toModel(data)
  }
}
