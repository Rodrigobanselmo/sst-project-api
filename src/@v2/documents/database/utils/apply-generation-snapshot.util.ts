import { DocumentData, Prisma } from '@prisma/client';

import {
  DocumentGenerationSnapshot,
  parseDocumentGenerationSnapshot,
} from '@/@v2/documents/domain/types/document-generation-snapshot.type';
import {
  DocumentGenerationRiskFilterSnapshot,
  parseDocumentGenerationRiskFilter,
} from '@/@v2/documents/domain/types/document-generation-risk-filter.type';

type ProfessionalSignatureRelation = {
  professionalId: number;
  isSigner: boolean;
  isElaborator: boolean;
  professional?: unknown;
};

type DocumentDataWithRelations = DocumentData & {
  professionalsSignatures?: ProfessionalSignatureRelation[];
};

type ApplyGenerationSnapshotOptions = {
  supplementalProfessionalSignatures?: Map<number, ProfessionalSignatureRelation>;
};

export const applyGenerationSnapshotToDocumentData = (
  documentData: DocumentDataWithRelations,
  snapshotValue: unknown,
  options?: ApplyGenerationSnapshotOptions,
): void => {
  const snapshot = parseDocumentGenerationSnapshot(snapshotValue);
  if (!snapshot) return;

  if (snapshot.coordinatorBy) {
    documentData.coordinatorBy = snapshot.coordinatorBy;
  }

  const currentJson =
    documentData.json && typeof documentData.json === 'object' && !Array.isArray(documentData.json)
      ? (documentData.json as Record<string, unknown>)
      : {};

  const snapshotJson =
    snapshot.json &&
    typeof snapshot.json === 'object' &&
    !Array.isArray(snapshot.json)
      ? (snapshot.json as Record<string, unknown>)
      : {};

  documentData.json = {
    ...currentJson,
    ...snapshotJson,
    ...(snapshot.legalResponsibleBy
      ? { legalResponsibleBy: snapshot.legalResponsibleBy }
      : {}),
  } as Prisma.JsonValue;

  if (snapshot.professionalSignatures === undefined) {
    return;
  }

  if (!snapshot.professionalSignatures.length) {
    documentData.professionalsSignatures = [];
    return;
  }

  const existingMap = new Map(
    (documentData.professionalsSignatures || []).map((signature) => [
      signature.professionalId,
      signature,
    ]),
  );

  documentData.professionalsSignatures = snapshot.professionalSignatures.map(
    (snapshotSignature) => {
      const existing = existingMap.get(snapshotSignature.professionalId);
      const supplemental = options?.supplementalProfessionalSignatures?.get(
        snapshotSignature.professionalId,
      );

      if (existing) {
        return {
          ...existing,
          isSigner: snapshotSignature.isSigner ?? existing.isSigner,
          isElaborator: snapshotSignature.isElaborator ?? existing.isElaborator,
        };
      }

      if (supplemental) {
        return {
          ...supplemental,
          isSigner: snapshotSignature.isSigner ?? supplemental.isSigner,
          isElaborator:
            snapshotSignature.isElaborator ?? supplemental.isElaborator,
        };
      }

      return {
        professionalId: snapshotSignature.professionalId,
        isSigner: snapshotSignature.isSigner ?? false,
        isElaborator: snapshotSignature.isElaborator ?? false,
      };
    },
  );
};

export const resolveSnapshotModelId = (
  snapshotValue: unknown,
  fallbackModelId: number | null | undefined,
): number | null | undefined => {
  const snapshot = parseDocumentGenerationSnapshot(snapshotValue);
  return snapshot?.modelId ?? fallbackModelId;
};

export const getSnapshotGhoIds = (snapshotValue: unknown): string[] | undefined => {
  const snapshot = parseDocumentGenerationSnapshot(snapshotValue);
  return snapshot?.ghoIds?.length ? snapshot.ghoIds : undefined;
};

export const getSnapshotRiskFilter = (
  snapshotValue: unknown,
): DocumentGenerationRiskFilterSnapshot | undefined => {
  const snapshot = parseDocumentGenerationSnapshot(snapshotValue);
  return parseDocumentGenerationRiskFilter(snapshot?.riskFilter);
};

export type { DocumentGenerationSnapshot, DocumentGenerationRiskFilterSnapshot };
