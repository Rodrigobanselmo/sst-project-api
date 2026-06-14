import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

import {
  HO_METHOD_CHEMICAL_ONLY_MESSAGE,
  HO_METHOD_CHEMICAL_RISK_TYPE,
} from './utils/ho-method-chemical.util';
import { HoMethodRiskFactorSnapshot } from './ho-method.types';

const riskSelect = {
  id: true,
  name: true,
  cas: true,
  synonymous: true,
  type: true,
  unit: true,
  nr15lt: true,
  twa: true,
  stel: true,
  json: true,
  search: true,
} satisfies Prisma.RiskFactorsSelect;

@Injectable()
export class HoMethodRiskSearchService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async search(params: {
    companyId: string;
    search?: string;
    limit?: number;
  }): Promise<HoMethodRiskFactorSnapshot[]> {
    const limit = params.limit ?? 50;
    const companyId = params.companyId;
    const search = params.search?.trim();

    const baseWhere: Prisma.RiskFactorsWhereInput = {
      deleted_at: null,
      status: 'ACTIVE',
      representAll: false,
      type: HO_METHOD_CHEMICAL_RISK_TYPE,
      OR: [{ companyId }, { system: true }],
    };

    if (!search) {
      const rows = await this.prisma.riskFactors.findMany({
        where: baseWhere,
        select: riskSelect,
        orderBy: { name: 'asc' },
        take: limit,
      });

      return rows.map((row) => this.mapRow(row));
    }

    const normalizedSearch = search.trim();
    const searchLower = normalizedSearch.toLowerCase();
    const casCompact = normalizedSearch.replace(/[-\s]/g, '');

    const [synonymIds, jsonCasIds] = await Promise.all([
      this.findIdsBySynonymSearch(companyId, normalizedSearch),
      casCompact.length >= 2
        ? this.findIdsByJsonCasSearch(companyId, normalizedSearch, casCompact)
        : Promise.resolve([] as string[]),
    ]);

    const extraIds = [...new Set([...synonymIds, ...jsonCasIds])];

    const searchWhere: Prisma.RiskFactorsWhereInput = {
      ...baseWhere,
      OR: [
        { name: { contains: normalizedSearch, mode: 'insensitive' } },
        { cas: { contains: normalizedSearch, mode: 'insensitive' } },
        ...(casCompact && casCompact !== normalizedSearch
          ? [{ cas: { contains: casCompact, mode: 'insensitive' as const } }]
          : []),
        { search: { contains: searchLower, mode: 'insensitive' } },
        { risk: { contains: normalizedSearch, mode: 'insensitive' } },
        ...(extraIds.length ? [{ id: { in: extraIds } }] : []),
      ],
    };

    const rows = await this.prisma.riskFactors.findMany({
      where: searchWhere,
      select: riskSelect,
      orderBy: { name: 'asc' },
      take: limit,
    });

    return rows.map((row) => this.mapRow(row));
  }

  async readById(params: {
    companyId: string;
    id: string;
  }): Promise<HoMethodRiskFactorSnapshot | null> {
    const record = await this.prisma.riskFactors.findFirst({
      where: {
        id: params.id,
        deleted_at: null,
        status: 'ACTIVE',
        representAll: false,
        type: HO_METHOD_CHEMICAL_RISK_TYPE,
        OR: [{ companyId: params.companyId }, { system: true }],
      },
      select: riskSelect,
    });

    return record ? this.mapRow(record) : null;
  }

  private async findIdsBySynonymSearch(
    companyId: string,
    search: string,
  ): Promise<string[]> {
    const likeTerm = `%${search}%`;

    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT DISTINCT rf."id"
      FROM "RiskFactors" rf
      CROSS JOIN LATERAL unnest(COALESCE(rf."synonymous", ARRAY[]::text[])) AS synonym
      LEFT JOIN LATERAL regexp_split_to_table(synonym, '[,;]') AS synonym_part ON true
      WHERE
        rf."deleted_at" IS NULL
        AND rf."status" = 'ACTIVE'
        AND rf."representAll" = false
        AND rf."type" = 'QUI'
        AND (rf."companyId" = ${companyId} OR rf."system" = true)
        AND (
          synonym ILIKE ${likeTerm}
          OR trim(synonym_part) ILIKE ${likeTerm}
        )
    `;

    return rows.map((row) => row.id);
  }

  private async findIdsByJsonCasSearch(
    companyId: string,
    search: string,
    casCompact: string,
  ): Promise<string[]> {
    const likeTerm = `%${search}%`;
    const likeCompact = `%${casCompact}%`;

    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT rf."id"
      FROM "RiskFactors" rf
      WHERE
        rf."deleted_at" IS NULL
        AND rf."status" = 'ACTIVE'
        AND rf."representAll" = false
        AND rf."type" = 'QUI'
        AND (rf."companyId" = ${companyId} OR rf."system" = true)
        AND (
          COALESCE(rf."json"::text, '') ILIKE ${likeTerm}
          OR COALESCE(rf."json"::text, '') ILIKE ${likeCompact}
        )
    `;

    return rows.map((row) => row.id);
  }

  private mapRow(
    row: Prisma.RiskFactorsGetPayload<{ select: typeof riskSelect }>,
  ): HoMethodRiskFactorSnapshot {
    return {
      id: row.id,
      name: row.name,
      cas: this.resolveCas(row),
      synonymous: this.expandSynonyms(row.synonymous ?? []),
      type: row.type,
      unit: row.unit,
      nr15lt: row.nr15lt,
      twa: row.twa,
      stel: row.stel,
    };
  }

  private resolveCas(
    row: Prisma.RiskFactorsGetPayload<{ select: typeof riskSelect }>,
  ): string | null {
    if (row.cas?.trim()) return row.cas.trim();

    const jsonText = JSON.stringify(row.json ?? {});
    const match = jsonText.match(/\b\d{2,7}-\d{2}-\d\b/);
    return match?.[0] ?? null;
  }

  private expandSynonyms(synonymous: string[]): string[] {
    const expanded = new Set<string>();

    synonymous.forEach((entry) => {
      const value = entry?.trim();
      if (!value) return;

      expanded.add(value);
      value.split(/[,;]/).forEach((part) => {
        const trimmed = part.trim();
        if (trimmed) expanded.add(trimmed);
      });
    });

    return Array.from(expanded);
  }
}
