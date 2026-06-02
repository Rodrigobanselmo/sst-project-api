import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  RiskCatalogEquivalenceType,
  RiskCatalogKind,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { RiskCatalogEquivalenceService } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.service';
import type { RegisterRiskCatalogEquivalenceParams } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.types';
import {
  buildCompanyCatalogVisibilityOr,
  buildGenerateSourceCatalogVisibilityWhere,
  buildRecMedCatalogVisibilityWhere,
  buildRecMedRiskScopeOr,
} from '@/shared/utils/risk-catalog-visibility.util';

function buildGenerateSourceCompanyOr(
  companyId: string,
  includeSystem?: boolean,
): Prisma.GenerateSourceWhereInput['OR'] {
  const or = buildCompanyCatalogVisibilityOr(companyId);
  if (includeSystem !== false) return or;
  return or.filter((clause) => !('system' in clause && clause.system === true));
}

function buildRecMedCompanyOr(
  companyId: string,
  includeSystem?: boolean,
): Prisma.RecMedWhereInput['OR'] {
  return buildGenerateSourceCompanyOr(
    companyId,
    includeSystem,
  ) as Prisma.RecMedWhereInput['OR'];
}

const SEARCH_LIMIT = 100;

/** Evita 0 resultados quando o texto termina com pontuação que não existe no cadastro. */
function normalizeCatalogSearchTerm(search: string): string {
  const trimmed = search.trim();
  const withoutTrailingPunctuation = trimmed.replace(/[.,;:!?]+$/u, '').trim();
  return withoutTrailingPunctuation || trimmed;
}

const EQUIVALENCE_LIST_SELECT = {
  id: true,
  kind: true,
  equivalenceType: true,
  riskId: true,
  canonicalId: true,
  aliasId: true,
  canonicalLabel: true,
  aliasLabel: true,
  normalizedKey: true,
  confirmedById: true,
  confirmedAt: true,
  revokedAt: true,
  revokeReason: true,
  metadata: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.RiskCatalogEquivalenceSelect;

type SearchParams = {
  kind: RiskCatalogKind;
  companyId?: string;
  riskId?: string;
  search?: string;
  includeSystem?: boolean;
  includeDeleted?: boolean;
};

type BrowseEquivalencesParams = {
  kind?: RiskCatalogKind;
  riskId?: string;
  canonicalId?: string;
  aliasId?: string;
  includeRevoked?: boolean;
};

type ImpactPreviewParams = {
  kind: RiskCatalogKind;
  canonicalId: string;
  aliasId: string;
  riskId: string;
};

@Injectable()
export class RiskCatalogEquivalenceMasterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly equivalenceService: RiskCatalogEquivalenceService,
  ) {}

  async searchCatalogItems(params: SearchParams) {
    if (params.kind === RiskCatalogKind.GENERATE_SOURCE) {
      return this.searchGenerateSources(params);
    }
    return this.searchRecMeds(params);
  }

  async browseEquivalences(params: BrowseEquivalencesParams) {
    const rows = await this.prisma.riskCatalogEquivalence.findMany({
      where: {
        ...(params.kind ? { kind: params.kind } : {}),
        ...(params.riskId ? { riskId: params.riskId } : {}),
        ...(params.canonicalId ? { canonicalId: params.canonicalId } : {}),
        ...(params.aliasId ? { aliasId: params.aliasId } : {}),
        ...(params.includeRevoked ? {} : { revokedAt: null }),
      },
      select: EQUIVALENCE_LIST_SELECT,
      orderBy: [{ created_at: 'desc' }],
    });
    return rows;
  }

  async previewImpact(params: ImpactPreviewParams) {
    if (params.aliasId === params.canonicalId) {
      throw new BadRequestException(
        'aliasId não pode ser igual a canonicalId',
      );
    }

    await this.assertCatalogPairExistsForPreview(params);

    if (params.kind === RiskCatalogKind.GENERATE_SOURCE) {
      return this.previewGenerateSourceImpact(params);
    }
    return this.previewRecMedImpact(params);
  }

  async registerEquivalence(
    params: RegisterRiskCatalogEquivalencePayload & {
      confirmedById: number;
    },
  ) {
    const labels = await this.resolveCatalogLabels(params);
    const registerParams: RegisterRiskCatalogEquivalenceParams = {
      kind: params.kind,
      equivalenceType: params.equivalenceType,
      riskId: params.riskId,
      canonicalId: params.canonicalId,
      aliasId: params.aliasId,
      canonicalLabel: labels.canonicalLabel,
      aliasLabel: labels.aliasLabel,
      normalizedKey:
        params.normalizedKey ?? labels.normalizedKey ?? undefined,
      confirmedById: params.confirmedById,
      confirmedAt: new Date(),
      metadata: params.metadata as RegisterRiskCatalogEquivalenceParams['metadata'],
    };

    const created =
      await this.equivalenceService.registerEquivalence(registerParams);

    return this.prisma.riskCatalogEquivalence.findUnique({
      where: { id: created.id },
      select: EQUIVALENCE_LIST_SELECT,
    });
  }

  async revokeEquivalence(id: string, revokeReason: string) {
    const revoked = await this.equivalenceService.revokeEquivalence(
      id,
      revokeReason,
    );

    return this.prisma.riskCatalogEquivalence.findUnique({
      where: { id: revoked.id },
      select: EQUIVALENCE_LIST_SELECT,
    });
  }

  private async searchGenerateSources(params: SearchParams) {
    const visibility = this.buildGenerateSourceSearchWhere(params);
    const rows = await this.prisma.generateSource.findMany({
      where: visibility,
      take: SEARCH_LIMIT,
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        riskId: true,
        name: true,
        companyId: true,
        system: true,
        deleted_at: true,
        company: { select: { name: true } },
        risk: { select: { name: true } },
      },
    });

    return this.enrichSearchItems(
      RiskCatalogKind.GENERATE_SOURCE,
      rows.map((row) => ({
        id: row.id,
        kind: RiskCatalogKind.GENERATE_SOURCE,
        label: row.name,
        riskId: row.riskId,
        riskName: row.risk.name,
        companyId: row.companyId,
        companyName: row.company.name,
        system: row.system,
        deleted_at: row.deleted_at,
        name: row.name,
      })),
    );
  }

  private async searchRecMeds(params: SearchParams) {
    const visibility = await this.buildRecMedSearchWhere(params);
    const rows = await this.prisma.recMed.findMany({
      where: visibility,
      take: SEARCH_LIMIT,
      orderBy: [{ recName: 'asc' }, { medName: 'asc' }],
      select: {
        id: true,
        riskId: true,
        recName: true,
        medName: true,
        recType: true,
        medType: true,
        companyId: true,
        system: true,
        deleted_at: true,
        company: { select: { name: true } },
        risk: { select: { name: true } },
      },
    });

    return this.enrichSearchItems(
      RiskCatalogKind.REC_MED,
      rows.map((row) => {
        const label = this.buildRecMedLabel(row.recName, row.medName);
        return {
          id: row.id,
          kind: RiskCatalogKind.REC_MED,
          label,
          riskId: row.riskId,
          riskName: row.risk.name,
          companyId: row.companyId,
          companyName: row.company.name,
          system: row.system,
          deleted_at: row.deleted_at,
          recName: row.recName,
          medName: row.medName,
          recType: row.recType,
          medType: row.medType,
        };
      }),
    );
  }

  private buildGenerateSourceSearchWhere(
    params: SearchParams,
  ): Prisma.GenerateSourceWhereInput {
    const companyId = params.companyId?.trim();
    let base = companyId
      ? this.buildGenerateSourceCompanyScopedWhere(params, companyId)
      : this.buildGenerateSourceGlobalWhere(params);

    if (!params.search?.trim()) return base;

    const term = normalizeCatalogSearchTerm(params.search);
    return {
      AND: [
        base,
        {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  private buildGenerateSourceCompanyScopedWhere(
    params: SearchParams,
    companyId: string,
  ): Prisma.GenerateSourceWhereInput {
    const companyOr = buildGenerateSourceCompanyOr(
      companyId,
      params.includeSystem,
    );

    let base: Prisma.GenerateSourceWhereInput = params.riskId
      ? buildGenerateSourceCatalogVisibilityWhere({
          riskId: params.riskId,
          companyId,
        })
      : {
          ...(params.includeDeleted ? {} : { deleted_at: null }),
          OR: companyOr,
        };

    if (params.riskId) {
      if (params.includeDeleted) {
        const { deleted_at: _deletedAt, ...withoutDeleted } = base;
        base = withoutDeleted;
      }
      if (params.includeSystem === false) {
        const andClauses = (
          Array.isArray(base.AND)
            ? [...base.AND]
            : base.AND
              ? [base.AND]
              : []
        ) as Prisma.GenerateSourceWhereInput[];
        base = {
          ...base,
          OR: companyOr,
          AND: andClauses.length ? andClauses : undefined,
        };
      }
    }

    return base;
  }

  private buildGenerateSourceGlobalWhere(
    params: SearchParams,
  ): Prisma.GenerateSourceWhereInput {
    return {
      ...(params.includeDeleted ? {} : { deleted_at: null }),
      ...(params.riskId ? { riskId: params.riskId } : {}),
      ...(params.includeSystem === false ? { system: false } : {}),
    };
  }

  private async buildRecMedSearchWhere(
    params: SearchParams,
  ): Promise<Prisma.RecMedWhereInput> {
    const companyId = params.companyId?.trim();
    let visibility = companyId
      ? await this.buildRecMedCompanyScopedWhere(params, companyId)
      : await this.buildRecMedGlobalWhere(params);

    if (!params.search?.trim()) return visibility;

    const term = normalizeCatalogSearchTerm(params.search);
    return {
      AND: [
        visibility,
        {
          OR: [
            { recName: { contains: term, mode: 'insensitive' } },
            { medName: { contains: term, mode: 'insensitive' } },
          ],
        },
      ],
    };
  }

  private async buildRecMedCompanyScopedWhere(
    params: SearchParams,
    companyId: string,
  ): Promise<Prisma.RecMedWhereInput> {
    const companyOr = buildRecMedCompanyOr(companyId, params.includeSystem);

    let visibility: Prisma.RecMedWhereInput;

    if (params.riskId) {
      const risk = await this.prisma.riskFactors.findUnique({
        where: { id: params.riskId },
        select: { type: true },
      });
      visibility = buildRecMedCatalogVisibilityWhere({
        riskId: params.riskId,
        companyId,
        riskType: risk?.type,
      });
      if (params.includeSystem === false) {
        const andClauses = (
          Array.isArray(visibility.AND)
            ? [...visibility.AND]
            : visibility.AND
              ? [visibility.AND]
              : []
        ) as Prisma.RecMedWhereInput[];
        visibility = {
          ...visibility,
          AND: [{ OR: companyOr }, ...andClauses.slice(1)],
        };
      }
      if (params.includeDeleted) {
        const { deleted_at: _d, ...rest } = visibility;
        visibility = rest;
      }
    } else {
      visibility = {
        ...(params.includeDeleted ? {} : { deleted_at: null }),
        AND: [{ OR: companyOr }],
      };
    }

    return visibility;
  }

  private async buildRecMedGlobalWhere(
    params: SearchParams,
  ): Promise<Prisma.RecMedWhereInput> {
    const andClauses: Prisma.RecMedWhereInput[] = [];

    if (params.riskId) {
      const risk = await this.prisma.riskFactors.findUnique({
        where: { id: params.riskId },
        select: { type: true },
      });
      const riskScope = buildRecMedRiskScopeOr({
        riskId: params.riskId,
        riskTypes: risk?.type ? [risk.type] : undefined,
      });
      if (riskScope) {
        andClauses.push({ OR: riskScope });
      }
    }

    return {
      ...(params.includeDeleted ? {} : { deleted_at: null }),
      ...(params.includeSystem === false ? { system: false } : {}),
      ...(andClauses.length ? { AND: andClauses } : {}),
    };
  }

  private async enrichSearchItems<
    T extends { id: string; kind: RiskCatalogKind; label: string },
  >(kind: RiskCatalogKind, items: T[]) {
    if (!items.length) return [];

    const aliasIds = items.map((i) => i.id);
    const activeEquivalences =
      await this.prisma.riskCatalogEquivalence.findMany({
        where: {
          kind,
          aliasId: { in: aliasIds },
          revokedAt: null,
        },
        select: {
          aliasId: true,
          canonicalId: true,
          canonicalLabel: true,
        },
      });

    const aliasMap = new Map(
      activeEquivalences.map((eq) => [eq.aliasId, eq]),
    );

    return items.map((item) => {
      const active = aliasMap.get(item.id);
      return {
        ...item,
        isAliasActive: Boolean(active),
        canonicalId: active?.canonicalId ?? null,
        canonicalLabel: active?.canonicalLabel ?? null,
      };
    });
  }

  private async assertCatalogPairExistsForPreview(params: ImpactPreviewParams) {
    if (params.kind === RiskCatalogKind.GENERATE_SOURCE) {
      const [canonical, alias] = await Promise.all([
        this.prisma.generateSource.findFirst({
          where: { id: params.canonicalId, deleted_at: null },
          select: { id: true, riskId: true },
        }),
        this.prisma.generateSource.findFirst({
          where: { id: params.aliasId, deleted_at: null },
          select: { id: true, riskId: true },
        }),
      ]);
      if (!canonical) {
        throw new NotFoundException('Fonte geradora canônica não encontrada');
      }
      if (!alias) {
        throw new NotFoundException('Fonte geradora alias não encontrada');
      }
      if (
        canonical.riskId !== params.riskId ||
        alias.riskId !== params.riskId
      ) {
        throw new BadRequestException(
          'riskId informado não corresponde aos itens do par',
        );
      }
      return;
    }

    const [canonical, alias] = await Promise.all([
      this.prisma.recMed.findFirst({
        where: { id: params.canonicalId, deleted_at: null },
        select: { id: true, riskId: true },
      }),
      this.prisma.recMed.findFirst({
        where: { id: params.aliasId, deleted_at: null },
        select: { id: true, riskId: true },
      }),
    ]);
    if (!canonical) {
      throw new NotFoundException('RecMed canônico não encontrado');
    }
    if (!alias) {
      throw new NotFoundException('RecMed alias não encontrado');
    }
    if (canonical.riskId !== params.riskId || alias.riskId !== params.riskId) {
      throw new BadRequestException(
        'riskId informado não corresponde aos itens do par',
      );
    }
  }

  private async previewGenerateSourceImpact(params: ImpactPreviewParams) {
    const aliasId = params.aliasId;
    const canonicalId = params.canonicalId;

    const [
      riskFactorDataWithAlias,
      riskFactorDataWithCanonical,
      riskFactorDataWithBoth,
      m2mLinksWithAlias,
    ] = await Promise.all([
      this.prisma.riskFactorData.count({
        where: { generateSources: { some: { id: aliasId } } },
      }),
      this.prisma.riskFactorData.count({
        where: { generateSources: { some: { id: canonicalId } } },
      }),
      this.prisma.riskFactorData.count({
        where: {
          AND: [
            { generateSources: { some: { id: aliasId } } },
            { generateSources: { some: { id: canonicalId } } },
          ],
        },
      }),
      this.prisma.generateSource
        .findUnique({
          where: { id: aliasId },
          select: { _count: { select: { riskFactorData: true } } },
        })
        .then((row) => row?._count.riskFactorData ?? 0),
    ]);

    return {
      kind: params.kind,
      riskId: params.riskId,
      canonicalId,
      aliasId,
      generateSource: {
        riskFactorDataWithAlias,
        riskFactorDataWithCanonical,
        riskFactorDataDuplicateIfMigrated: riskFactorDataWithBoth,
        m2mLinksWithAlias,
      },
    };
  }

  private async previewRecMedImpact(params: ImpactPreviewParams) {
    const aliasId = params.aliasId;
    const canonicalId = params.canonicalId;

    const aliasOnRiskData = { recs: { some: { rec_med_id: aliasId } } };
    const canonicalOnRiskData = {
      recs: { some: { rec_med_id: canonicalId } },
    };
    const aliasEngs = {
      engsToRiskFactorData: { some: { recMedId: aliasId } },
    };
    const canonicalEngs = {
      engsToRiskFactorData: { some: { recMedId: canonicalId } },
    };
    const aliasAdms = { adms: { some: { id: aliasId } } };
    const canonicalAdms = { adms: { some: { id: canonicalId } } };

    const linkedViaAlias: Prisma.RiskFactorDataWhereInput[] = [
      aliasOnRiskData,
      aliasEngs,
      aliasAdms,
    ];
    const linkedViaCanonical: Prisma.RiskFactorDataWhereInput[] = [
      canonicalOnRiskData,
      canonicalEngs,
      canonicalAdms,
    ];

    const [
      recMedOnRiskDataWithAlias,
      engsToRiskFactorDataWithAlias,
      admsM2mLinksWithAlias,
      riskFactorDataRecWithAlias,
      derivedMeasuresWithAlias,
      characterizationPhotoRecommendationsWithAlias,
      riskFactorDataWithCanonicalAnyLink,
      riskFactorDataDuplicateIfMigrated,
    ] = await Promise.all([
      this.prisma.recMedOnRiskData.count({
        where: { rec_med_id: aliasId },
      }),
      this.prisma.engsToRiskFactorData.count({
        where: { recMedId: aliasId },
      }),
      this.prisma.riskFactorData.count({ where: aliasAdms }),
      this.prisma.riskFactorDataRec.count({ where: { recMedId: aliasId } }),
      this.prisma.riskFactorDataRecDerivedMeasure.count({
        where: {
          OR: [
            { sourceRecMedId: aliasId },
            { derivedRecMedId: aliasId },
          ],
        },
      }),
      this.prisma.characterizationPhotoRecommendation.count({
        where: { recommendation_id: aliasId },
      }),
      this.prisma.riskFactorData.count({
        where: { OR: linkedViaCanonical },
      }),
      this.prisma.riskFactorData.count({
        where: {
          AND: [{ OR: linkedViaAlias }, { OR: linkedViaCanonical }],
        },
      }),
    ]);

    return {
      kind: params.kind,
      riskId: params.riskId,
      canonicalId,
      aliasId,
      recMed: {
        recMedOnRiskDataWithAlias,
        engsToRiskFactorDataWithAlias,
        admsM2mLinksWithAlias,
        riskFactorDataRecWithAlias,
        riskFactorDataRecDerivedMeasureWithAlias: derivedMeasuresWithAlias,
        characterizationPhotoRecommendationsWithAlias,
        riskFactorDataWithCanonicalAnyLink,
        riskFactorDataDuplicateIfMigrated,
      },
    };
  }

  private async resolveCatalogLabels(
    params: RegisterRiskCatalogEquivalencePayload,
  ) {
    if (params.kind === RiskCatalogKind.GENERATE_SOURCE) {
      const [canonical, alias] = await Promise.all([
        this.prisma.generateSource.findFirst({
          where: { id: params.canonicalId, deleted_at: null },
          select: { name: true },
        }),
        this.prisma.generateSource.findFirst({
          where: { id: params.aliasId, deleted_at: null },
          select: { name: true },
        }),
      ]);
      if (!canonical) {
        throw new NotFoundException('Fonte geradora canônica não encontrada');
      }
      if (!alias) {
        throw new NotFoundException('Fonte geradora alias não encontrada');
      }
      return {
        canonicalLabel: canonical.name,
        aliasLabel: alias.name,
        normalizedKey:
          params.normalizedKey ??
          RiskCatalogEquivalenceService.buildNormalizedKeyForGenerateSource(
            alias.name,
          ),
      };
    }

    const [canonical, alias] = await Promise.all([
      this.prisma.recMed.findFirst({
        where: { id: params.canonicalId, deleted_at: null },
        select: { recName: true, medName: true },
      }),
      this.prisma.recMed.findFirst({
        where: { id: params.aliasId, deleted_at: null },
        select: { recName: true, medName: true },
      }),
    ]);
    if (!canonical) {
      throw new NotFoundException('RecMed canônico não encontrado');
    }
    if (!alias) {
      throw new NotFoundException('RecMed alias não encontrado');
    }

    return {
      canonicalLabel: this.buildRecMedLabel(canonical.recName, canonical.medName),
      aliasLabel: this.buildRecMedLabel(alias.recName, alias.medName),
      normalizedKey:
        params.normalizedKey ??
        RiskCatalogEquivalenceService.buildNormalizedKeyForRecMed(
          alias.recName,
          alias.medName,
        ),
    };
  }

  private buildRecMedLabel(
    recName?: string | null,
    medName?: string | null,
  ): string {
    const rec = recName?.trim();
    if (rec) return rec;
    return medName?.trim() ?? '';
  }
}

type RegisterRiskCatalogEquivalencePayload = {
  kind: RiskCatalogKind;
  equivalenceType: RiskCatalogEquivalenceType;
  riskId: string;
  canonicalId: string;
  aliasId: string;
  normalizedKey?: string;
  metadata?: Record<string, unknown>;
};
