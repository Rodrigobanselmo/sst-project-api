import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RiskCatalogKind } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { normalizeInventoryItemName } from '@/shared/utils/normalize-inventory-item-name.util';

import {
  buildAliasToCanonicalMapFromRows,
  getCanonicalOrSelfFromMap,
  resolveCanonicalIdFromMap,
} from './risk-catalog-equivalence.util';
import type {
  RegisterRiskCatalogEquivalenceParams,
  RiskCatalogAliasToCanonicalMap,
  RiskCatalogEquivalenceRow,
} from './risk-catalog-equivalence.types';

const ACTIVE_EQUIVALENCE_WHERE = { revokedAt: null } as const;

@Injectable()
export class RiskCatalogEquivalenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveEquivalenceByAlias(
    kind: RiskCatalogKind,
    aliasId: string,
  ): Promise<RiskCatalogEquivalenceRow | null> {
    return this.prisma.riskCatalogEquivalence.findFirst({
      where: { kind, aliasId, ...ACTIVE_EQUIVALENCE_WHERE },
      select: RiskCatalogEquivalenceService.selectFields,
    });
  }

  async findActiveByRiskIds(
    kind: RiskCatalogKind,
    riskIds: string[],
  ): Promise<RiskCatalogEquivalenceRow[]> {
    if (!riskIds.length) return [];

    return this.prisma.riskCatalogEquivalence.findMany({
      where: {
        kind,
        riskId: { in: riskIds },
        ...ACTIVE_EQUIVALENCE_WHERE,
      },
      select: RiskCatalogEquivalenceService.selectFields,
    });
  }

  async buildCanonicalCatalogMap(
    kind: RiskCatalogKind,
    riskId: string,
  ): Promise<RiskCatalogAliasToCanonicalMap> {
    const rows = await this.prisma.riskCatalogEquivalence.findMany({
      where: { kind, riskId, ...ACTIVE_EQUIVALENCE_WHERE },
      select: { aliasId: true, canonicalId: true },
    });
    return buildAliasToCanonicalMapFromRows(rows);
  }

  async buildCanonicalCatalogMapForRiskIds(
    kind: RiskCatalogKind,
    riskIds: string[],
  ): Promise<RiskCatalogAliasToCanonicalMap> {
    if (!riskIds.length) return new Map();

    const rows = await this.prisma.riskCatalogEquivalence.findMany({
      where: {
        kind,
        riskId: { in: riskIds },
        ...ACTIVE_EQUIVALENCE_WHERE,
      },
      select: { aliasId: true, canonicalId: true },
    });
    return buildAliasToCanonicalMapFromRows(rows);
  }

  /** IDs de alias ativos para ocultar em dropdowns (escopo por riskIds). */
  async getActiveAliasIdsForRiskIds(
    kind: RiskCatalogKind,
    riskIds: string[],
  ): Promise<string[]> {
    if (!riskIds.length) return [];
    const rows = await this.findActiveByRiskIds(kind, riskIds);
    return rows.map((row) => row.aliasId);
  }

  async resolveCanonicalCatalogId(
    kind: RiskCatalogKind,
    itemId: string,
  ): Promise<string> {
    const map = await this.loadMapForItem(kind, itemId);
    return getCanonicalOrSelfFromMap(itemId, map);
  }

  resolveCanonicalCatalogIdFromMap(
    kind: RiskCatalogKind,
    itemId: string,
    map: RiskCatalogAliasToCanonicalMap,
  ): string {
    return getCanonicalOrSelfFromMap(itemId, map);
  }

  async resolveCanonicalGenerateSourceId(id: string): Promise<string> {
    return this.resolveCanonicalCatalogId(RiskCatalogKind.GENERATE_SOURCE, id);
  }

  async resolveCanonicalRecMedId(id: string): Promise<string> {
    return this.resolveCanonicalCatalogId(RiskCatalogKind.REC_MED, id);
  }

  getCanonicalOrSelf(
    itemId: string,
    aliasToCanonical: RiskCatalogAliasToCanonicalMap,
  ): string {
    return getCanonicalOrSelfFromMap(itemId, aliasToCanonical);
  }

  /**
   * Registra equivalência ativa (uso Master / seed / testes).
   * Não migra vínculos existentes nesta fase.
   */
  async registerEquivalence(params: RegisterRiskCatalogEquivalenceParams) {
    if (params.aliasId === params.canonicalId) {
      throw new BadRequestException(
        'aliasId não pode ser igual a canonicalId',
      );
    }

    if (!params.riskId?.trim()) {
      throw new BadRequestException('riskId é obrigatório');
    }

    const existingActive = await this.getActiveEquivalenceByAlias(
      params.kind,
      params.aliasId,
    );
    if (existingActive) {
      throw new BadRequestException(
        'Já existe equivalência ativa para este aliasId',
      );
    }

    await this.validateCatalogPair(params);

    const confirmedAt = params.confirmedAt ?? new Date();

    return this.prisma.riskCatalogEquivalence.create({
      data: {
        kind: params.kind,
        equivalenceType: params.equivalenceType,
        riskId: params.riskId,
        canonicalId: params.canonicalId,
        aliasId: params.aliasId,
        canonicalLabel: params.canonicalLabel,
        aliasLabel: params.aliasLabel,
        normalizedKey: params.normalizedKey ?? null,
        confirmedById: params.confirmedById ?? null,
        confirmedAt,
        metadata: params.metadata ?? Prisma.JsonNull,
      },
      select: RiskCatalogEquivalenceService.selectFields,
    });
  }

  async revokeEquivalence(id: string, revokeReason?: string) {
    const row = await this.prisma.riskCatalogEquivalence.findUnique({
      where: { id },
    });
    if (!row) throw new NotFoundException('Equivalência não encontrada');
    if (row.revokedAt) {
      throw new BadRequestException('Equivalência já revogada');
    }

    return this.prisma.riskCatalogEquivalence.update({
      where: { id },
      data: {
        revokedAt: new Date(),
        revokeReason: revokeReason ?? null,
      },
      select: RiskCatalogEquivalenceService.selectFields,
    });
  }

  private async loadMapForItem(
    kind: RiskCatalogKind,
    itemId: string,
  ): Promise<Map<string, string>> {
    const active = await this.getActiveEquivalenceByAlias(kind, itemId);
    if (active) {
      return new Map([[itemId, active.canonicalId]]);
    }
    return new Map();
  }

  private async validateCatalogPair(
    params: RegisterRiskCatalogEquivalenceParams,
  ) {
    if (params.kind === RiskCatalogKind.GENERATE_SOURCE) {
      await this.validateGenerateSourcePair(params);
      return;
    }
    await this.validateRecMedPair(params);
  }

  private async validateGenerateSourcePair(
    params: RegisterRiskCatalogEquivalenceParams,
  ) {
    const [canonical, alias] = await Promise.all([
      this.prisma.generateSource.findFirst({
        where: { id: params.canonicalId, deleted_at: null },
        select: {
          id: true,
          riskId: true,
          companyId: true,
          system: true,
          name: true,
        },
      }),
      this.prisma.generateSource.findFirst({
        where: { id: params.aliasId, deleted_at: null },
        select: {
          id: true,
          riskId: true,
          companyId: true,
          system: true,
          name: true,
        },
      }),
    ]);

    if (!canonical) {
      throw new NotFoundException('Fonte geradora canônica não encontrada');
    }
    if (!alias) {
      throw new NotFoundException('Fonte geradora alias não encontrada');
    }

    this.assertRiskScope(params.riskId, canonical.riskId, alias.riskId);
    this.assertSameCatalogScope(canonical, alias, params.allowCrossScope);

    if (params.riskId !== canonical.riskId) {
      throw new BadRequestException(
        'riskId informado não corresponde ao canônico',
      );
    }
  }

  private async validateRecMedPair(params: RegisterRiskCatalogEquivalenceParams) {
    const [canonical, alias] = await Promise.all([
      this.prisma.recMed.findFirst({
        where: { id: params.canonicalId, deleted_at: null },
        select: {
          id: true,
          riskId: true,
          companyId: true,
          system: true,
          recName: true,
          medName: true,
          risk: { select: { representAll: true, type: true } },
        },
      }),
      this.prisma.recMed.findFirst({
        where: { id: params.aliasId, deleted_at: null },
        select: {
          id: true,
          riskId: true,
          companyId: true,
          system: true,
          recName: true,
          medName: true,
          risk: { select: { representAll: true, type: true } },
        },
      }),
    ]);

    if (!canonical) {
      throw new NotFoundException('RecMed canônico não encontrado');
    }
    if (!alias) {
      throw new NotFoundException('RecMed alias não encontrado');
    }

    if (canonical.riskId !== alias.riskId) {
      const representAllMismatch =
        canonical.risk.representAll || alias.risk.representAll;
      if (representAllMismatch) {
        throw new BadRequestException(
          'Equivalência com riskId distinto envolvendo representAll não é permitida nesta fase',
        );
      }
      throw new BadRequestException(
        'Canônico e alias devem pertencer ao mesmo riskId',
      );
    }

    this.assertRiskScope(params.riskId, canonical.riskId, alias.riskId);
    this.assertSameCatalogScope(canonical, alias, params.allowCrossScope);

    if (params.riskId !== canonical.riskId) {
      throw new BadRequestException(
        'riskId informado não corresponde ao canônico',
      );
    }
  }

  private assertRiskScope(
    declaredRiskId: string,
    canonicalRiskId: string,
    aliasRiskId: string,
  ) {
    if (canonicalRiskId !== aliasRiskId) return;
    if (declaredRiskId !== canonicalRiskId) {
      throw new BadRequestException(
        'riskId informado não corresponde aos itens do par',
      );
    }
  }

  private assertSameCatalogScope(
    canonical: { companyId: string; system: boolean },
    alias: { companyId: string; system: boolean },
    allowCrossScope?: boolean,
  ) {
    if (allowCrossScope) return;

    // Canônico de sistema: padrão global — aceita alias de qualquer empresa ou system.
    if (canonical.system) return;

    // Canônico de empresa não pode ter alias de sistema.
    if (alias.system) {
      throw new BadRequestException(
        'Item de sistema deve ser usado como canônico. Inverta a seleção.',
      );
    }

    if (canonical.companyId !== alias.companyId) {
      throw new BadRequestException(
        'Não é possível mesclar itens de empresas diferentes nesta fase.',
      );
    }
  }

  static readonly selectFields = {
    id: true,
    kind: true,
    equivalenceType: true,
    riskId: true,
    canonicalId: true,
    aliasId: true,
    canonicalLabel: true,
    aliasLabel: true,
    normalizedKey: true,
  } satisfies Prisma.RiskCatalogEquivalenceSelect;

  static buildNormalizedKeyForGenerateSource(name: string): string {
    return normalizeInventoryItemName(name);
  }

  static buildNormalizedKeyForRecMed(recName?: string | null, medName?: string | null): string {
    const rec = normalizeInventoryItemName(recName);
    if (rec) return rec;
    return normalizeInventoryItemName(medName);
  }
}
