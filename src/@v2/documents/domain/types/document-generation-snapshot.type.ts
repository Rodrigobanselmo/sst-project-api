import { Prisma } from '@prisma/client';

export type DocumentGenerationProfessionalSnapshot = {
  professionalId: number;
  isSigner?: boolean;
  isElaborator?: boolean;
};

export type DocumentGenerationFilterItemSnapshot = {
  id: string;
  name?: string;
};

export type DocumentGenerationSnapshot = {
  ghoIds?: string[];
  filterViewType?: string;
  selectedFilters?: DocumentGenerationFilterItemSnapshot[];
  modelId?: number;
  coordinatorBy?: string;
  legalResponsibleBy?: string;
  json?: Prisma.JsonValue;
  professionalSignatures?: DocumentGenerationProfessionalSnapshot[];
};

export const parseDocumentGenerationSnapshot = (
  value: unknown,
): DocumentGenerationSnapshot | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as DocumentGenerationSnapshot;
};

export const buildDocumentGenerationSnapshot = (params: {
  ghoIds?: string[];
  filterViewType?: string;
  selectedFilters?: DocumentGenerationFilterItemSnapshot[];
  modelId?: number;
  coordinatorBy?: string;
  legalResponsibleBy?: string;
  json?: Prisma.JsonValue;
  professionalSignatures?: DocumentGenerationProfessionalSnapshot[];
}): DocumentGenerationSnapshot => ({
  ...(params.ghoIds?.length ? { ghoIds: params.ghoIds } : {}),
  ...(params.filterViewType ? { filterViewType: params.filterViewType } : {}),
  ...(params.selectedFilters?.length ? { selectedFilters: params.selectedFilters } : {}),
  ...(params.modelId ? { modelId: params.modelId } : {}),
  ...(params.coordinatorBy ? { coordinatorBy: params.coordinatorBy } : {}),
  ...(params.legalResponsibleBy ? { legalResponsibleBy: params.legalResponsibleBy } : {}),
  ...(params.json &&
  typeof params.json === 'object' &&
  !Array.isArray(params.json) &&
  Object.keys(params.json).length
    ? { json: params.json }
    : {}),
  ...(params.professionalSignatures?.length
    ? { professionalSignatures: params.professionalSignatures }
    : {}),
});
