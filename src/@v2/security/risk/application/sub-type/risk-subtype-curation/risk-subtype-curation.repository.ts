import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

import {
  RiskSubtypeCurationFilterEnum,
  RiskSubtypeCurationRiskRow,
} from './risk-subtype-curation.types';
import type { RiskSubtypeCurationSuggestEligibleRisk } from './risk-subtype-curation-suggest.types';

export type BrowseCurationRisksParams = {
  page: number;
  limit: number;
  filters: {
    type?: RiskTypeEnum;
    search?: string;
    status?: StatusEnum;
    onlyPcmso?: boolean;
    subtypeFilter?: RiskSubtypeCurationFilterEnum;
    subtypeId?: number;
  };
};

const riskSelect = {
  id: true,
  name: true,
  type: true,
  cas: true,
  esocialCode: true,
  status: true,
  isPCMSO: true,
  subTypes: {
    select: {
      sub_type: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.RiskFactorsSelect;

const suggestRiskSelect = {
  id: true,
  name: true,
  cas: true,
  synonymous: true,
  esocialCode: true,
  risk: true,
  symptoms: true,
  coments: true,
  method: true,
  nr15lt: true,
  twa: true,
  stel: true,
  ipvs: true,
  subTypes: {
    select: {
      sub_type: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.RiskFactorsSelect;

@Injectable()
export class RiskSubtypeCurationRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browseRisks({ page, limit, filters }: BrowseCurationRisksParams) {
    const where = this.buildRiskWhere(filters);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.prisma.riskFactors.findMany({
        where,
        select: riskSelect,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.riskFactors.count({ where }),
    ]);

    return {
      results: rows.map((row) => this.mapRiskRow(row)),
      pagination: { page, limit, total },
    };
  }

  findGlobalRisksByIds(ids: string[]) {
    if (!ids.length) return Promise.resolve([]);

    return this.prisma.riskFactors.findMany({
      where: {
        id: { in: ids },
        system: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  findSubTypeById(id: number) {
    return this.prisma.riskSubType.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
      },
    });
  }

  async findEligibleRisksForSuggestion(params: {
    type: RiskTypeEnum;
    onlyPcmso: boolean;
    search?: string;
    take: number;
  }): Promise<{ rows: RiskSubtypeCurationSuggestEligibleRisk[]; total: number }> {
    const where = this.buildRiskWhere({
      type: params.type,
      status: StatusEnum.ACTIVE,
      onlyPcmso: params.onlyPcmso,
      search: params.search,
      subtypeFilter: RiskSubtypeCurationFilterEnum.NONE,
    });

    const [rows, total] = await Promise.all([
      this.prisma.riskFactors.findMany({
        where,
        select: suggestRiskSelect,
        orderBy: [{ name: 'asc' }],
        take: params.take,
      }),
      this.prisma.riskFactors.count({ where }),
    ]);

    return {
      rows: rows.map((row) => this.mapSuggestRiskRow(row)),
      total,
    };
  }

  replaceRiskSubTypes(riskId: string, subTypeId: number) {
    return this.prisma.$transaction([
      this.prisma.riskToRiskSubType.deleteMany({ where: { risk_id: riskId } }),
      this.prisma.riskToRiskSubType.create({
        data: { risk_id: riskId, sub_type_id: subTypeId },
      }),
    ]);
  }

  clearRiskSubTypes(riskId: string) {
    return this.prisma.riskToRiskSubType.deleteMany({
      where: { risk_id: riskId },
    });
  }

  countRiskFactorDataByRiskIds(riskIds: string[]) {
    if (!riskIds.length) return Promise.resolve(0);

    return this.prisma.riskFactorData.count({
      where: { riskId: { in: riskIds } },
    });
  }

  private buildRiskWhere(
    filters: BrowseCurationRisksParams['filters'],
  ): Prisma.RiskFactorsWhereInput {
    const where: Prisma.RiskFactorsWhereInput = {
      system: true,
      deleted_at: null,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.onlyPcmso === true) {
      where.isPCMSO = true;
    }

    const search = filters.search?.trim();
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cas: { contains: search, mode: 'insensitive' } },
        { esocialCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const subtypeFilter =
      filters.subtypeFilter ?? RiskSubtypeCurationFilterEnum.ALL;

    if (subtypeFilter === RiskSubtypeCurationFilterEnum.NONE) {
      where.subTypes = { none: {} };
    }

    if (subtypeFilter === RiskSubtypeCurationFilterEnum.SPECIFIC) {
      where.subTypes = {
        some: { sub_type_id: filters.subtypeId },
      };
    }

    return where;
  }

  private mapRiskRow(
    row: Prisma.RiskFactorsGetPayload<{ select: typeof riskSelect }>,
  ): RiskSubtypeCurationRiskRow {
    return {
      riskFactorId: row.id,
      name: row.name,
      type: row.type,
      cas: row.cas,
      esocialCode: row.esocialCode,
      status: row.status,
      isPCMSO: row.isPCMSO,
      subTypes: row.subTypes.map((link) => ({
        id: link.sub_type.id,
        name: link.sub_type.name,
      })),
    };
  }

  private mapSuggestRiskRow(
    row: Prisma.RiskFactorsGetPayload<{ select: typeof suggestRiskSelect }>,
  ): RiskSubtypeCurationSuggestEligibleRisk {
    return {
      id: row.id,
      name: row.name,
      cas: row.cas,
      synonymous: row.synonymous ?? [],
      esocialCode: row.esocialCode,
      risk: row.risk,
      symptoms: row.symptoms,
      coments: row.coments,
      method: row.method,
      nr15lt: row.nr15lt,
      twa: row.twa,
      stel: row.stel,
      ipvs: row.ipvs,
      subTypes: row.subTypes.map((link) => ({
        id: link.sub_type.id,
        name: link.sub_type.name,
      })),
    };
  }
}
