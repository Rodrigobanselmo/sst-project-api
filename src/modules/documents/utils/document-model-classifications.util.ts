import { BadRequestException } from '@nestjs/common';
import { DocumentModelClassificationEnum, DocumentTypeEnum } from '@prisma/client';

import {
  filterClassificationsForDocumentType,
  isClassificationApplicableToDocumentType,
} from '../constants/document-model-classification-applicability';

const MUTUALLY_EXCLUSIVE_PAIRS: [DocumentModelClassificationEnum, DocumentModelClassificationEnum][] = [
  [DocumentModelClassificationEnum.GRO_PGR, DocumentModelClassificationEnum.SOMENTE_PGR],
  [DocumentModelClassificationEnum.COM_FRPS, DocumentModelClassificationEnum.SEM_FRPS],
  [DocumentModelClassificationEnum.COPSOQ_III, DocumentModelClassificationEnum.NAO_COPSOQ_III],
];

export function normalizeDocumentModelClassifications(
  classifications?: DocumentModelClassificationEnum[] | null,
): DocumentModelClassificationEnum[] {
  if (!classifications?.length) return [];
  return [...new Set(classifications)];
}

export function assertValidDocumentModelClassifications(
  classifications?: DocumentModelClassificationEnum[] | null,
  documentType?: DocumentTypeEnum,
): void {
  const normalized = normalizeDocumentModelClassifications(classifications);
  const set = new Set(normalized);

  if (documentType) {
    for (const classification of normalized) {
      if (!isClassificationApplicableToDocumentType(classification, documentType)) {
        throw new BadRequestException(
          `Classificação ${classification} não é válida para o tipo de documento ${documentType}.`,
        );
      }
    }
  }

  for (const [a, b] of MUTUALLY_EXCLUSIVE_PAIRS) {
    if (set.has(a) && set.has(b)) {
      throw new BadRequestException(
        `Classificações incompatíveis: não é possível combinar ${a} com ${b}.`,
      );
    }
  }
}

export function normalizeClassificationsForDocumentType(
  classifications: DocumentModelClassificationEnum[] | undefined | null,
  documentType: DocumentTypeEnum,
): DocumentModelClassificationEnum[] {
  return filterClassificationsForDocumentType(
    normalizeDocumentModelClassifications(classifications),
    documentType,
  );
}
