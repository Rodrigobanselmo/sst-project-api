import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';

export type DocumentEmissionDateSource = {
  documentDate?: Date | null;
  createdAt: Date;
};

/** Data exibida no DOCX: emissão informada pelo usuário, com fallback de auditoria. */
export const resolveDocumentEmissionDate = (
  source: DocumentEmissionDateSource,
): Date => source.documentDate ?? source.createdAt;

export const parseDocumentEmissionDate = (
  value?: string | Date | null,
): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Aplica data de emissão ao modelo em memória (versão atual). */
export const applyDocumentEmissionDateToPgrModel = (
  document: DocumentPGRModel,
  emissionDate: Date,
): void => {
  document.documentVersion.documentDate = emissionDate;

  const currentVersionKey = document.documentVersion.version;
  for (const version of document.documentBase.allVersions) {
    if (version.version === currentVersionKey) {
      version.documentDate = emissionDate;
    }
  }
};
