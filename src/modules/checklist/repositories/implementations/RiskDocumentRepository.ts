/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocumentDto } from '../../dto/risk-document.dto';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';

@Injectable()
export class RiskDocumentRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({
    companyId,
    id,
    ...createDto
  }: UpsertRiskDocumentDto): Promise<RiskDocumentEntity> {
    const riskFactorDocEntity = await this.prisma.riskFactorDocument.upsert({
      create: {
        companyId,
        ...createDto,
      },
      update: {
        ...createDto,
        companyId,
      },
      where: { id_companyId: { companyId, id: id || 'not-found' } },
    });

    return new RiskDocumentEntity(riskFactorDocEntity);
  }

  async findByRiskGroupAndCompany(riskGroupId: string, companyId: string) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findMany({
      where: { companyId, riskGroupId },
    });

    return riskDocumentEntity.map((data) => new RiskDocumentEntity(data));
  }

  async findById(
    id: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorGroupDataSelect;
      include?: Prisma.RiskFactorGroupDataInclude;
    } = {},
  ) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findUnique({
      where: { id_companyId: { id, companyId } },
      ...options,
    });

    return new RiskDocumentEntity(riskDocumentEntity);
  }
}
