import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { DocumentTypeEnum, Prisma, StatusEnum } from '@prisma/client';

import {
  filterOfficialVersionsBySeries,
  isOfficialDocumentVersion,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocumentDto } from '../../dto/risk-document.dto';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';
import { FindDocVersionDto } from '../../dto/doc-version.dto';

@Injectable()
export class RiskDocumentRepository {
  constructor(private prisma: PrismaService) {}

  async resolveOfficialRevisionSeriesForVersion(
    documentDataId: string,
    companyId: string,
    version: string,
  ): Promise<number | null> {
    if (!isOfficialDocumentVersion(version)) return null;

    const documentData = await this.prisma.documentData.findUnique({
      where: { id_companyId: { id: documentDataId, companyId } },
      select: { officialRevisionSeries: true },
    });

    return documentData?.officialRevisionSeries ?? 1;
  }

  async resolveRevisionSnapshotFromDocumentData(
    documentDataId: string,
    companyId: string,
  ) {
    return this.prisma.documentData.findUnique({
      where: { id_companyId: { id: documentDataId, companyId } },
      select: {
        approvedBy: true,
        revisionBy: true,
        elaboratedBy: true,
      },
    });
  }

  async resolveValiditySnapshotFromDocumentData(
    documentDataId: string,
    companyId: string,
    version: string,
  ) {
    const documentData = await this.prisma.documentData.findUnique({
      where: { id_companyId: { id: documentDataId, companyId } },
      select: {
        validityStart: true,
        validityEnd: true,
        validityYears: true,
        validityMonths: true,
      },
    });

    if (!documentData?.validityStart) {
      return {
        documentCreatedAt: undefined,
        validityYears: undefined,
        validityMonths: undefined,
        validityEndSnapshot: undefined,
      };
    }

    const snapshot = {
      documentCreatedAt: documentData.validityStart.toISOString(),
      validityYears: documentData.validityYears ?? undefined,
      validityMonths: documentData.validityMonths ?? undefined,
      validityEndSnapshot: documentData.validityEnd?.toISOString(),
    };

    if (!isOfficialDocumentVersion(version)) {
      return {
        documentCreatedAt: snapshot.documentCreatedAt,
      };
    }

    return snapshot;
  }

  async upsert({
    companyId,
    attachments,
    documentDate,
    documentCreatedAt,
    validityYears,
    validityMonths,
    validityEndSnapshot,
    officialRevisionSeries,
    generationSnapshot,
    ...createDto
  }: UpsertRiskDocumentDto): Promise<RiskDocumentEntity> {
    const data = {
      ...createDto,
      ...(documentDate ? { documentDate: new Date(documentDate) } : {}),
      ...(documentCreatedAt
        ? { documentCreatedAt: new Date(documentCreatedAt) }
        : {}),
      ...(validityYears !== undefined ? { validityYears } : {}),
      ...(validityMonths !== undefined ? { validityMonths } : {}),
      ...(validityEndSnapshot
        ? { validityEndSnapshot: new Date(validityEndSnapshot) }
        : {}),
      ...(officialRevisionSeries !== undefined
        ? { officialRevisionSeries }
        : {}),
      ...(generationSnapshot !== undefined ? { generationSnapshot } : {}),
    };

    const riskFactorDocEntity = await this.prisma.riskFactorDocument.upsert({
      create: {
        ...data,
        attachments: attachments
          ? {
              create: attachments.map((attachment) => ({
                ...attachment,
              })),
            }
          : undefined,
        companyId,
      },
      update: {
        ...data,
        attachments: attachments
          ? {
              create: attachments.map((attachment) => ({
                ...attachment,
              })),
            }
          : undefined,
        companyId,
      },
      where: { id_companyId: { companyId, id: createDto.id || 'not-found' } },
    });

    return new RiskDocumentEntity(riskFactorDocEntity);
  }

  async findByRiskGroupAndCompany(documentDataId: string, companyId: string) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findMany({
      where: { companyId, documentDataId },
    });

    return riskDocumentEntity.map((data) => new RiskDocumentEntity(data));
  }

  async findDocumentData(documentDataId: string, companyId: string, type: DocumentTypeEnum) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findMany({
      where: {
        companyId,
        documentDataId,
        version: { endsWith: '.0.0', not: '0.0.0' },
        documentData: { type },
      },
    });

    return filterOfficialVersionsBySeries(
      riskDocumentEntity.map((data) => new RiskDocumentEntity(data)),
      (
        await this.prisma.documentData.findUnique({
          where: { id_companyId: { id: documentDataId, companyId } },
          select: { officialRevisionSeries: true },
        })
      )?.officialRevisionSeries ?? 1,
    );
  }

  async find(
    query: Partial<FindDocVersionDto & { companyId: string }>,
    pagination: PaginationQueryDto,
    options: Prisma.RiskFactorDocumentFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'type'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { version: { contains: query.search, mode: 'insensitive' } },
        ],
      } as typeof options.where);
    }

    if ('type' in query) {
      (where.AND as any).push({
        documentData: { type: query.type },
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.riskFactorDocument.count({
        where,
      }),
      this.prisma.riskFactorDocument.findMany({
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { created_at: 'desc' },
        ...options,
      }),
    ]);

    return {
      data: response[1].map((doc) => new RiskDocumentEntity(doc)),
      count: response[0],
    };
  }

  async findById(
    id: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorDocumentSelect;
      include?: Prisma.RiskFactorDocumentInclude;
    } = {},
  ) {
    const riskDocumentEntity = await this.prisma.riskFactorDocument.findUnique({
      where: { id_companyId: { id, companyId } },
      ...options,
    });

    return new RiskDocumentEntity(riskDocumentEntity);
  }

  async delete(id: string, companyId: string) {
    const existing = await this.prisma.riskFactorDocument.findUnique({
      where: { id_companyId: { id, companyId } },
    });

    if (!existing) return null;

    await this.prisma.attachments.deleteMany({
      where: { riskFactorDocumentId: id },
    });

    const riskFactorDocEntity = await this.prisma.riskFactorDocument.delete({
      where: { id_companyId: { id, companyId } },
    });

    return new RiskDocumentEntity(riskFactorDocEntity);
  }

  async countProcessingUnofficial(documentDataId: string, companyId: string) {
    return this.prisma.riskFactorDocument.count({
      where: {
        companyId,
        documentDataId,
        status: StatusEnum.PROCESSING,
        version: { startsWith: '0.0.' },
      },
    });
  }

  async countProcessingOfficialInSeries(
    documentDataId: string,
    companyId: string,
    officialRevisionSeries: number,
  ) {
    return this.prisma.riskFactorDocument.count({
      where: {
        companyId,
        documentDataId,
        status: StatusEnum.PROCESSING,
        officialRevisionSeries,
        version: { endsWith: '.0.0', not: '0.0.0' },
      },
    });
  }

  async deleteUnofficialByDocumentDataId(
    documentDataId: string,
    companyId: string,
  ) {
    const unofficialDocs = await this.prisma.riskFactorDocument.findMany({
      where: {
        companyId,
        documentDataId,
        version: { startsWith: '0.0.' },
      },
      select: { id: true },
    });

    if (unofficialDocs.length === 0) return 0;

    const ids = unofficialDocs.map((doc) => doc.id);

    await this.prisma.attachments.deleteMany({
      where: { riskFactorDocumentId: { in: ids } },
    });

    const result = await this.prisma.riskFactorDocument.deleteMany({
      where: { id: { in: ids }, companyId },
    });

    return result.count;
  }

  async deleteAttachmentsByDocumentVersionId(documentVersionId: string) {
    await this.prisma.attachments.deleteMany({
      where: { riskFactorDocumentId: documentVersionId },
    });
  }

  async updateForRegeneration(params: {
    id: string;
    companyId: string;
    name: string;
    description: string;
    documentDate?: string;
    approvedBy?: string | null;
    elaboratedBy?: string | null;
    revisionBy?: string | null;
    generationSnapshot: Prisma.InputJsonValue;
  }) {
    const riskFactorDocEntity = await this.prisma.riskFactorDocument.update({
      where: { id_companyId: { id: params.id, companyId: params.companyId } },
      data: {
        name: params.name,
        description: params.description,
        approvedBy: params.approvedBy,
        elaboratedBy: params.elaboratedBy,
        revisionBy: params.revisionBy,
        generationSnapshot: params.generationSnapshot,
        status: StatusEnum.PROCESSING,
        fileUrl: null,
        ...(params.documentDate ? { documentDate: new Date(params.documentDate) } : {}),
      },
    });

    return new RiskDocumentEntity(riskFactorDocEntity);
  }
}
