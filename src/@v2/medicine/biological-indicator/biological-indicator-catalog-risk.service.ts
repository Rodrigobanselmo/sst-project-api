import { PrismaClient, RiskFactors } from '@prisma/client';

import { simpleCompanyId } from '@/shared/constants/ids';

import {
  NR07_CATALOG_RISK_DEFINITIONS,
  Nr07CatalogRiskDefinition,
} from './biological-indicator-catalog-risk.constant';
import {
  collectNormalizedCasNumbers,
  collectRiskNormalizedNames,
  hasCasIntersection,
  normalizeRiskNameForMatch,
} from './biological-indicator-risk-match.util';
import { normalizeText } from './biological-indicator-normalize.util';

export type CatalogRiskEnsureAction = 'created' | 'reused';

export type CatalogRiskEnsureResult = {
  key: string;
  name: string;
  action: CatalogRiskEnsureAction;
  matchedBy?: 'CAS' | 'NAME' | 'SYNONYM';
  existingName?: string;
  risk: Pick<RiskFactors, 'id' | 'name' | 'cas' | 'type' | 'system' | 'companyId' | 'synonymous'>;
};

type RiskSnapshot = Pick<RiskFactors, 'id' | 'name' | 'cas' | 'type' | 'system' | 'companyId' | 'synonymous'>;

const normalizeSynonym = (value: string): string => normalizeText(value);

const collectDefinitionSearchTerms = (
  definition: Nr07CatalogRiskDefinition,
): string[] =>
  Array.from(
    new Set(
      [definition.name, ...definition.synonymous]
        .map((value) => normalizeRiskNameForMatch(value))
        .filter(Boolean),
    ),
  );

const collectRiskSearchTerms = (risk: RiskSnapshot): string[] => {
  const terms = new Set<string>([
    normalizeRiskNameForMatch(risk.name),
    ...risk.synonymous.map((value) => normalizeSynonym(value)),
    ...collectRiskNormalizedNames({
      id: risk.id,
      name: risk.name,
      cas: risk.cas,
      synonymous: risk.synonymous,
    }),
  ]);

  return Array.from(terms).filter(Boolean);
};

export class BiologicalIndicatorCatalogRiskService {
  constructor(private readonly prisma: PrismaClient) {}

  private async loadCatalogRisks(): Promise<RiskSnapshot[]> {
    return this.prisma.riskFactors.findMany({
      where: {
        system: true,
        type: 'QUI',
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        cas: true,
        type: true,
        system: true,
        companyId: true,
        synonymous: true,
      },
    });
  }

  findExistingRisk(
    definition: Nr07CatalogRiskDefinition,
    risks: RiskSnapshot[],
  ): { risk: RiskSnapshot; matchedBy: 'CAS' | 'NAME' | 'SYNONYM' } | null {
    if (definition.cas) {
      const byCas = risks.find((risk) =>
        hasCasIntersection(definition.cas!, risk.cas),
      );

      if (byCas) {
        return { risk: byCas, matchedBy: 'CAS' };
      }
    }

    const definitionTerms = collectDefinitionSearchTerms(definition);
    const normalizedName = normalizeRiskNameForMatch(definition.name);

    const byName = risks.find((risk) =>
      collectRiskSearchTerms(risk).includes(normalizedName),
    );

    if (byName) {
      return { risk: byName, matchedBy: 'NAME' };
    }

    const bySynonym = risks.find((risk) => {
      const riskTerms = new Set(collectRiskSearchTerms(risk));
      return definitionTerms.some((term) => riskTerms.has(term));
    });

    if (bySynonym) {
      return { risk: bySynonym, matchedBy: 'SYNONYM' };
    }

    return null;
  }

  async ensureDefinition(
    definition: Nr07CatalogRiskDefinition,
    risks: RiskSnapshot[],
  ): Promise<CatalogRiskEnsureResult> {
    const existing = this.findExistingRisk(definition, risks);

    if (existing) {
      return {
        key: definition.key,
        name: definition.name,
        action: 'reused',
        matchedBy: existing.matchedBy,
        existingName:
          existing.risk.name !== definition.name ? existing.risk.name : undefined,
        risk: existing.risk,
      };
    }

    const created = await this.prisma.riskFactors.create({
      data: {
        name: definition.name,
        cas: definition.cas,
        synonymous: definition.synonymous,
        type: 'QUI',
        system: true,
        companyId: simpleCompanyId,
        coments: definition.notes,
      },
      select: {
        id: true,
        name: true,
        cas: true,
        type: true,
        system: true,
        companyId: true,
        synonymous: true,
      },
    });

    risks.push(created);

    return {
      key: definition.key,
      name: definition.name,
      action: 'created',
      risk: created,
    };
  }

  async ensureAll(): Promise<CatalogRiskEnsureResult[]> {
    const risks = await this.loadCatalogRisks();
    const results: CatalogRiskEnsureResult[] = [];

    for (const definition of NR07_CATALOG_RISK_DEFINITIONS) {
      results.push(await this.ensureDefinition(definition, risks));
    }

    return results;
  }
}

export const summarizeCatalogRiskCas = (cas: string | null | undefined): string | null => {
  if (!cas?.trim()) return null;

  const values = collectNormalizedCasNumbers(cas);
  return values.length ? cas.trim() : null;
};
