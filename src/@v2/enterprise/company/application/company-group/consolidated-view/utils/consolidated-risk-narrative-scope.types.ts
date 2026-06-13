export type ConsolidatedRiskNarrativeGroupingMode =
  | 'overview'
  | 'company'
  | 'application'
  | 'establishment'
  | 'sector'
  | 'riskFactor'
  | 'riskLevel'
  | 'status';

export type ConsolidatedRiskNarrativeFilters = {
  companyId?: string | null;
  formApplicationId?: string | null;
  riskLevel?: string | null;
  status?: string | null;
  search?: string | null;
};

export type ConsolidatedRiskNarrativeScope = {
  groupingMode: ConsolidatedRiskNarrativeGroupingMode;
  filters: ConsolidatedRiskNarrativeFilters;
};

const normalizeFilterValue = (value: unknown): string | null => {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : null;
};

export const normalizeConsolidatedRiskNarrativeScope = (
  scope: Partial<ConsolidatedRiskNarrativeScope> & {
    filters?: Partial<ConsolidatedRiskNarrativeFilters>;
  },
): ConsolidatedRiskNarrativeScope => {
  const groupingMode = (scope.groupingMode?.trim() ||
    'overview') as ConsolidatedRiskNarrativeGroupingMode;

  return {
    groupingMode,
    filters: {
      companyId: normalizeFilterValue(scope.filters?.companyId),
      formApplicationId: normalizeFilterValue(scope.filters?.formApplicationId),
      riskLevel: normalizeFilterValue(scope.filters?.riskLevel),
      status: normalizeFilterValue(scope.filters?.status),
      search: normalizeFilterValue(scope.filters?.search),
    },
  };
};

const buildFiltersPart = (filters: ConsolidatedRiskNarrativeFilters): string => {
  const parts = [
    filters.companyId ? `company:${filters.companyId}` : null,
    filters.formApplicationId ? `app:${filters.formApplicationId}` : null,
    filters.riskLevel ? `nro:${filters.riskLevel}` : null,
    filters.status ? `status:${filters.status}` : null,
    filters.search ? `search:${filters.search}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join('|') : '_all_filters_';
};

export const buildConsolidatedRiskNarrativeScopeKey = (params: {
  companyGroupId: number;
  applicationIds: string[];
  scope: ConsolidatedRiskNarrativeScope;
}): string => {
  const appsPart = [...new Set(params.applicationIds)].sort().join('|');
  const filtersPart = buildFiltersPart(params.scope.filters);

  return `consolidated::cg${params.companyGroupId}::apps::${appsPart}::mode::${params.scope.groupingMode}::filters::${filtersPart}`;
};

export const getConsolidatedRiskNarrativeStorageAnchor = (params: {
  applicationIds: string[];
}) => {
  const sortedApplicationIds = [...new Set(params.applicationIds)].sort();
  return sortedApplicationIds[0] ?? '';
};
