import {
  Prisma,
  RiskCatalogEquivalenceType,
  RiskCatalogKind,
} from '@prisma/client';

export type RiskCatalogAliasToCanonicalMap = ReadonlyMap<string, string>;

export type RegisterRiskCatalogEquivalenceParams = {
  kind: RiskCatalogKind;
  equivalenceType: RiskCatalogEquivalenceType;
  riskId: string;
  canonicalId: string;
  aliasId: string;
  canonicalLabel: string;
  aliasLabel: string;
  normalizedKey?: string | null;
  confirmedById?: number | null;
  confirmedAt?: Date | null;
  metadata?: Prisma.InputJsonValue;
  /** TODO(fase-2): permitir merge cross-company/system com confirmação Master explícita. */
  allowCrossScope?: boolean;
};

export type RiskCatalogEquivalenceRow = {
  id: string;
  kind: RiskCatalogKind;
  equivalenceType: RiskCatalogEquivalenceType;
  riskId: string;
  canonicalId: string;
  aliasId: string;
  canonicalLabel: string;
  aliasLabel: string;
  normalizedKey: string | null;
};
