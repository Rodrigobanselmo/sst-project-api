import { Injectable } from '@nestjs/common';
import {
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

export type BrowseBiologicalIndicatorsFilters = {
  search?: string;
  substanceName?: string;
  cas?: string;
  tableNumber?: BiologicalIndicatorTableEnum;
  indicatorType?: BiologicalIndicatorTypeEnum;
  status?: BiologicalIndicatorStatusEnum;
  requiresNormativeReview?: boolean;
  isSubstanceGroup?: boolean;
  hasConfirmedRisk?: boolean;
  hasConfirmedExam?: boolean;
  hasPendency?: boolean;
};

export type BrowseBiologicalIndicatorsParams = {
  page: number;
  limit: number;
  filters?: BrowseBiologicalIndicatorsFilters;
};

const indicatorListSelect = {
  id: true,
  substanceName: true,
  casNumbers: true,
  casPrimary: true,
  biologicalIndicatorOriginal: true,
  biologicalIndicatorNormalized: true,
  biologicalMatrix: true,
  collectionMoment: true,
  tableNumber: true,
  indicatorType: true,
  referenceValue: true,
  unit: true,
  technicalObservations: true,
  status: true,
  requiresNormativeReview: true,
  isSubstanceGroup: true,
  reviewedAt: true,
  substanceGroup: {
    select: {
      id: true,
      name: true,
      groupType: true,
    },
  },
  riskLinks: {
    where: { deleted_at: null },
    select: {
      id: true,
      isConfirmed: true,
      isPrimary: true,
      requiresReview: true,
      matchConfidence: true,
      matchMethod: true,
      riskNameSnapshot: true,
      riskCasSnapshot: true,
      riskFactor: {
        select: { id: true, name: true, cas: true },
      },
    },
  },
  examLinks: {
    where: { deleted_at: null },
    select: {
      id: true,
      isConfirmed: true,
      isDefault: true,
      requiresReview: true,
      matchConfidence: true,
      matchMethod: true,
      examNameSnapshot: true,
      examMaterialSnapshot: true,
      exam: {
        select: { id: true, name: true, material: true },
      },
    },
  },
} satisfies Prisma.OccupationalBiologicalIndicatorSelect;

@Injectable()
export class BiologicalIndicatorDAO {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    filters: BrowseBiologicalIndicatorsFilters = {},
  ): Prisma.OccupationalBiologicalIndicatorWhereInput {
    const where: Prisma.OccupationalBiologicalIndicatorWhereInput = {
      deleted_at: null,
    };

    if (filters.search?.trim()) {
      const search = filters.search.trim();
      where.OR = [
        { substanceName: { contains: search, mode: 'insensitive' } },
        { biologicalIndicatorOriginal: { contains: search, mode: 'insensitive' } },
        { biologicalIndicatorNormalized: { contains: search, mode: 'insensitive' } },
        { casNumbers: { has: search } },
      ];
    }

    if (filters.substanceName?.trim()) {
      where.substanceName = {
        contains: filters.substanceName.trim(),
        mode: 'insensitive',
      };
    }

    if (filters.cas?.trim()) {
      where.casNumbers = { has: filters.cas.trim() };
    }

    if (filters.tableNumber) where.tableNumber = filters.tableNumber;
    if (filters.indicatorType) where.indicatorType = filters.indicatorType;
    if (filters.status) where.status = filters.status;
    if (filters.requiresNormativeReview !== undefined) {
      where.requiresNormativeReview = filters.requiresNormativeReview;
    }
    if (filters.isSubstanceGroup !== undefined) {
      where.isSubstanceGroup = filters.isSubstanceGroup;
    }

    if (filters.hasConfirmedRisk === true) {
      where.riskLinks = {
        some: { deleted_at: null, isConfirmed: true },
      };
    } else if (filters.hasConfirmedRisk === false) {
      where.NOT = {
        riskLinks: {
          some: { deleted_at: null, isConfirmed: true },
        },
      };
    }

    if (filters.hasConfirmedExam === true) {
      where.examLinks = {
        some: { deleted_at: null, isConfirmed: true },
      };
    } else if (filters.hasConfirmedExam === false) {
      where.NOT = {
        ...(where.NOT as object),
        examLinks: {
          some: { deleted_at: null, isConfirmed: true },
        },
      };
    }

    return where;
  }

  async browse(params: BrowseBiologicalIndicatorsParams) {
    const where = this.buildWhere(params.filters);
    const skip = (params.page - 1) * params.limit;

    const [count, data] = await this.prisma.$transaction([
      this.prisma.occupationalBiologicalIndicator.count({ where }),
      this.prisma.occupationalBiologicalIndicator.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: [{ substanceName: 'asc' }, { biologicalIndicatorNormalized: 'asc' }],
        select: indicatorListSelect,
      }),
    ]);

    const rows = data.map((row) => ({
      ...row,
      pendencies: this.computePendencies(row),
    }));

    const filteredRows =
      params.filters?.hasPendency === undefined
        ? rows
        : rows.filter((row) =>
            params.filters?.hasPendency ? row.pendencies.length > 0 : row.pendencies.length === 0,
          );

    return {
      count: params.filters?.hasPendency === undefined ? count : filteredRows.length,
      data: filteredRows,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(id: string) {
    const indicator = await this.prisma.occupationalBiologicalIndicator.findFirst({
      where: { id, deleted_at: null },
      include: {
        substanceGroup: true,
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
        riskLinks: {
          where: { deleted_at: null },
          include: {
            riskFactor: {
              select: { id: true, name: true, cas: true, type: true, system: true },
            },
            confirmedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: [{ isPrimary: 'desc' }, { isConfirmed: 'desc' }, { created_at: 'asc' }],
        },
        examLinks: {
          where: { deleted_at: null },
          include: {
            exam: {
              select: {
                id: true,
                name: true,
                material: true,
                analyses: true,
                instruction: true,
                type: true,
                system: true,
                esocial27Code: true,
              },
            },
            confirmedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: [{ isDefault: 'desc' }, { isConfirmed: 'desc' }, { created_at: 'asc' }],
        },
      },
    });

    if (!indicator) return null;

    return {
      ...indicator,
      pendencies: this.computePendencies(indicator),
    };
  }

  private computePendencies(
    indicator: {
      requiresNormativeReview: boolean;
      reviewedAt: Date | null;
      riskLinks: Array<{ isConfirmed: boolean; isPrimary: boolean; deleted_at?: Date | null }>;
      examLinks: Array<{ isConfirmed: boolean; isDefault: boolean; deleted_at?: Date | null }>;
    },
  ) {
    const pendencies: Array<{ code: string; message: string }> = [];

    const confirmedRisks = indicator.riskLinks.filter(
      (link) => !link.deleted_at && link.isConfirmed,
    );
    const confirmedExams = indicator.examLinks.filter(
      (link) => !link.deleted_at && link.isConfirmed,
    );

    if (!confirmedRisks.length) {
      pendencies.push({
        code: 'RISK_NOT_CONFIRMED',
        message: 'Sem risco confirmado.',
      });
    }

    if (!confirmedExams.length) {
      pendencies.push({
        code: 'EXAM_NOT_CONFIRMED',
        message: 'Sem exame confirmado.',
      });
    }

    if (confirmedRisks.length > 1 && confirmedRisks.filter((l) => l.isPrimary).length !== 1) {
      pendencies.push({
        code: 'RISK_PRIMARY_REQUIRED',
        message: 'Risco principal pendente.',
      });
    }

    if (confirmedExams.length > 0 && confirmedExams.filter((l) => l.isDefault).length !== 1) {
      pendencies.push({
        code: 'EXAM_DEFAULT_REQUIRED',
        message: 'Exame padrão pendente.',
      });
    }

    if (indicator.requiresNormativeReview && !indicator.reviewedAt) {
      pendencies.push({
        code: 'NORMATIVE_REVIEW_REQUIRED',
        message: 'Revisão normativa/médica pendente.',
      });
    }

    return pendencies;
  }
}
