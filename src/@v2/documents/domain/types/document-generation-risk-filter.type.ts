import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type DocumentGenerationRiskFilterSnapshot = {
  mode: 'EXCLUDE';
  excludedRiskFactorIds?: string[];
  excludedCategoryIds?: RiskTypeEnum[];
  excludedSubcategoryIds?: number[];
};

export const hasActiveDocumentRiskFilter = (
  filter?: DocumentGenerationRiskFilterSnapshot | null,
): filter is DocumentGenerationRiskFilterSnapshot => {
  if (!filter || filter.mode !== 'EXCLUDE') return false;

  return Boolean(
    filter.excludedRiskFactorIds?.length ||
      filter.excludedCategoryIds?.length ||
      filter.excludedSubcategoryIds?.length,
  );
};

export const parseDocumentGenerationRiskFilter = (
  value: unknown,
): DocumentGenerationRiskFilterSnapshot | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const filter = value as DocumentGenerationRiskFilterSnapshot;
  if (filter.mode !== 'EXCLUDE') return undefined;

  const parsed: DocumentGenerationRiskFilterSnapshot = {
    mode: 'EXCLUDE',
    ...(filter.excludedRiskFactorIds?.length
      ? { excludedRiskFactorIds: [...new Set(filter.excludedRiskFactorIds)] }
      : {}),
    ...(filter.excludedCategoryIds?.length
      ? { excludedCategoryIds: [...new Set(filter.excludedCategoryIds)] }
      : {}),
    ...(filter.excludedSubcategoryIds?.length
      ? {
          excludedSubcategoryIds: [
            ...new Set(filter.excludedSubcategoryIds.map(Number)),
          ],
        }
      : {}),
  };

  return hasActiveDocumentRiskFilter(parsed) ? parsed : undefined;
};
