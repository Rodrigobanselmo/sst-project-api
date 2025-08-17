import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IBrowseRisksUseCase } from './browse-risks.types';

@Injectable()
export class BrowseRisksUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IBrowseRisksUseCase.Params): Promise<IBrowseRisksUseCase.Result[]> {
    const risks = await this.prisma.riskFactors.findMany({
      where: {
        companyId: params.companyId,
        status: 'ACTIVE',
        deleted_at: null,
        type: 'ERG',
        subTypes: {
          some: {
            sub_type: {
              sub_type: 'PSICOSOCIAL',
            },
          },
        },
      },
      select: { id: true, name: true, severity: true },
    });

    return risks;
  }
}
