import { DocumentData, Prisma } from '@prisma/client';

import {
  DocumentGenerationSnapshot,
  parseDocumentGenerationSnapshot,
} from '@/@v2/documents/domain/types/document-generation-snapshot.type';

type DocumentDataWithRelations = DocumentData & {
  professionalsSignatures?: Array<{
    professionalId: number;
    isSigner: boolean;
    isElaborator: boolean;
    professional?: unknown;
  }>;
};

export const applyGenerationSnapshotToDocumentData = (
  documentData: DocumentDataWithRelations,
  snapshotValue: unknown,
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

  if (snapshot.professionalSignatures?.length && documentData.professionalsSignatures) {
    const signatureMap = new Map(
      snapshot.professionalSignatures.map((item) => [item.professionalId, item]),
    );

    documentData.professionalsSignatures = documentData.professionalsSignatures
      .filter((signature) => signatureMap.has(signature.professionalId))
      .map((signature) => {
        const snapshotSignature = signatureMap.get(signature.professionalId);

        return {
          ...signature,
          isSigner: snapshotSignature?.isSigner ?? signature.isSigner,
          isElaborator: snapshotSignature?.isElaborator ?? signature.isElaborator,
        };
      });
  }
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

export type { DocumentGenerationSnapshot };
