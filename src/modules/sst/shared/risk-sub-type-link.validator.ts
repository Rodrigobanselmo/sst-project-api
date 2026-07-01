import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RiskSubTypeLinkValidator {
  constructor(private readonly prisma: PrismaService) {}

  async assertValidLinks(
    riskType: RiskFactorsEnum,
    subTypesIds?: number[],
  ): Promise<void> {
    if (!subTypesIds?.length) {
      return;
    }

    const uniqueIds = [...new Set(subTypesIds)];
    const subTypes = await this.prisma.riskSubType.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true, type: true, status: true, name: true },
    });

    if (subTypes.length !== uniqueIds.length) {
      throw new BadRequestException('Um ou mais subtipos informados não existem.');
    }

    for (const subType of subTypes) {
      if (subType.status !== StatusEnum.ACTIVE) {
        throw new BadRequestException(
          `O subtipo "${subType.name}" está inativo e não pode ser vinculado.`,
        );
      }

      if (subType.type !== riskType) {
        throw new BadRequestException(
          `O subtipo "${subType.name}" não pertence ao tipo de risco ${riskType}.`,
        );
      }
    }
  }
}
