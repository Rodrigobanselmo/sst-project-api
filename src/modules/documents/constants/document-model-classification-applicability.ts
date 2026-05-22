import { DocumentModelClassificationEnum, DocumentTypeEnum } from '@prisma/client';

/** Tipos em que cada classificação padrão pode ser usada (espelhar client). */
export const DOCUMENT_MODEL_CLASSIFICATION_APPLICABILITY: Record<
  DocumentModelClassificationEnum,
  DocumentTypeEnum[]
> = {
  [DocumentModelClassificationEnum.GRO_PGR]: [DocumentTypeEnum.PGR],
  [DocumentModelClassificationEnum.SOMENTE_PGR]: [DocumentTypeEnum.PGR],
  [DocumentModelClassificationEnum.COM_FRPS]: [DocumentTypeEnum.PGR],
  [DocumentModelClassificationEnum.SEM_FRPS]: [DocumentTypeEnum.PGR],
  [DocumentModelClassificationEnum.COPSOQ_III]: [DocumentTypeEnum.PGR, DocumentTypeEnum.FRPS],
  [DocumentModelClassificationEnum.NAO_COPSOQ_III]: [DocumentTypeEnum.PGR, DocumentTypeEnum.FRPS],
  [DocumentModelClassificationEnum.NR18]: [DocumentTypeEnum.PGR],
  [DocumentModelClassificationEnum.TERCEIROS]: Object.values(DocumentTypeEnum),
  [DocumentModelClassificationEnum.SIMPLIFICADO]: Object.values(DocumentTypeEnum),
  [DocumentModelClassificationEnum.BACKUP]: Object.values(DocumentTypeEnum),
};

export function isClassificationApplicableToDocumentType(
  classification: DocumentModelClassificationEnum,
  documentType: DocumentTypeEnum,
): boolean {
  return DOCUMENT_MODEL_CLASSIFICATION_APPLICABILITY[classification]?.includes(documentType) ?? false;
}

export function filterClassificationsForDocumentType(
  classifications: DocumentModelClassificationEnum[],
  documentType: DocumentTypeEnum,
): DocumentModelClassificationEnum[] {
  return classifications.filter((item) => isClassificationApplicableToDocumentType(item, documentType));
}
