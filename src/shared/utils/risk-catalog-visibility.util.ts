import { Prisma, RiskFactorsEnum, StatusEnum } from '@prisma/client';

/**
 * Mesmo escopo de visibilidade de `GenerateSourceRepository.find` / `RecMedRepository.find`
 * (companyId da consulta, contrato ativo e system).
 */
export function buildCompanyCatalogVisibilityOr(
  companyId: string,
): Prisma.GenerateSourceWhereInput['OR'] {
  return [
    { companyId },
    {
      company: {
        applyingServiceContracts: {
          some: {
            receivingServiceCompanyId: companyId,
            status: StatusEnum.ACTIVE,
          },
        },
      },
    },
    { system: true },
  ];
}

export function buildGenerateSourceCatalogVisibilityWhere(params: {
  riskId: string;
  companyId: string;
}): Prisma.GenerateSourceWhereInput {
  return {
    riskId: params.riskId,
    deleted_at: null,
    OR: buildCompanyCatalogVisibilityOr(params.companyId),
  };
}

function buildRecMedCompanyCatalogVisibilityOr(
  companyId: string,
): Prisma.RecMedWhereInput['OR'] {
  return [
    { companyId },
    {
      company: {
        applyingServiceContracts: {
          some: {
            receivingServiceCompanyId: companyId,
            status: StatusEnum.ACTIVE,
          },
        },
      },
    },
    { system: true },
  ];
}

/** Mesmo escopo de risco que `RecMedRepository.find` (riskIds + risco representAll por tipo). */
export function buildRecMedRiskScopeOr(params: {
  riskId?: string;
  riskIds?: string[];
  riskTypes?: RiskFactorsEnum[];
}): Prisma.RecMedWhereInput['OR'] | undefined {
  if (params.riskId) {
    const scope: Prisma.RecMedWhereInput['OR'] = [{ riskId: params.riskId }];
    if (params.riskTypes?.length) {
      scope.push({
        risk: { representAll: true, type: { in: params.riskTypes } },
      });
    }
    return scope;
  }

  if (params.riskIds?.length) {
    const scope: Prisma.RecMedWhereInput['OR'] = [{ riskId: { in: params.riskIds } }];
    if (params.riskTypes?.length) {
      scope.push({
        risk: { representAll: true, type: { in: params.riskTypes } },
      });
    }
    return scope;
  }

  return undefined;
}

export function buildRecMedCatalogVisibilityWhere(params: {
  riskId: string;
  companyId: string;
  riskType?: RiskFactorsEnum;
}): Prisma.RecMedWhereInput {
  const riskScope = buildRecMedRiskScopeOr({
    riskId: params.riskId,
    riskTypes: params.riskType ? [params.riskType] : undefined,
  });

  return {
    deleted_at: null,
    AND: [
      { OR: buildRecMedCompanyCatalogVisibilityOr(params.companyId) },
      ...(riskScope ? [{ OR: riskScope }] : []),
    ],
  };
}

/** Lote para status de catálogo (vários pares riskId + empresa operacional). */
export function buildBatchRiskCatalogVisibilityWhere(params: {
  riskIds: string[];
  companyIds: string[];
}): Prisma.GenerateSourceWhereInput {
  return {
    riskId: { in: params.riskIds },
    deleted_at: null,
    OR: [
      { companyId: { in: params.companyIds } },
      { system: true },
      {
        company: {
          applyingServiceContracts: {
            some: {
              receivingServiceCompanyId: { in: params.companyIds },
              status: StatusEnum.ACTIVE,
            },
          },
        },
      },
    ],
  };
}

export function buildBatchRecMedCatalogVisibilityWhere(params: {
  riskIds: string[];
  companyIds: string[];
  riskTypes?: RiskFactorsEnum[];
}): Prisma.RecMedWhereInput {
  const riskScope = buildRecMedRiskScopeOr({
    riskIds: params.riskIds,
    riskTypes: params.riskTypes,
  });

  return {
    deleted_at: null,
    AND: [
      {
        OR: [
          { companyId: { in: params.companyIds } },
          { system: true },
          {
            company: {
              applyingServiceContracts: {
                some: {
                  receivingServiceCompanyId: { in: params.companyIds },
                  status: StatusEnum.ACTIVE,
                },
              },
            },
          },
        ],
      },
      ...(riskScope ? [{ OR: riskScope }] : []),
    ],
  };
}

type CatalogVisibilityRecord = {
  companyId: string;
  system: boolean;
  contractReceiverCompanyIds?: string[];
};

/** Registro retornado pela query ampliada é visível para a empresa operacional do par. */
export function isRiskCatalogRecordVisibleForCompany(
  record: CatalogVisibilityRecord,
  queryCompanyId: string,
): boolean {
  if (record.companyId === queryCompanyId) return true;
  if (record.system) return true;
  if (record.contractReceiverCompanyIds?.includes(queryCompanyId)) return true;
  return false;
}

export function rankRiskCatalogCandidate(
  record: { companyId: string; system: boolean },
  queryCompanyId: string,
): number {
  if (record.companyId === queryCompanyId) return 1;
  if (record.system) return 2;
  return 3;
}
