import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IEditHierarchyUseCase } from './edit-hierarchy.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class EditHierarchyUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IEditHierarchyUseCase.Params) {
    const hierarchy = await this.prisma.hierarchy.findFirst({
      where: {
        id: params.id,
        companyId: params.companyId,
      },
      select: { id: true, metadata: true },
    });

    if (!hierarchy) throw new BadRequestException('Hierarquia não encontrada');

    const newMetadata = { ...(typeof hierarchy.metadata === 'object' ? hierarchy.metadata : {}), ...(params.metadata || {}) } as Prisma.InputJsonValue;

    await this.prisma.hierarchy.update({
      where: { id: params.id },
      data: {
        name: params.name,
        description: params.description,
        realDescription: params.realDescription,
        metadata: newMetadata,
      },
    });
  }
}
