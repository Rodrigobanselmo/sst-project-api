import {
  getOfficialVersionMajor,
  getUnofficialVersionPatch,
  isOfficialDocumentVersion,
  isUnofficialDocumentVersion,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';

/**
 * Converte a versão técnica interna (0.0.N ou N.0.0) para o número sequencial
 * exibido no DOCX (01, 02, 03…), alinhado à coluna "Nº" da tabela de revisões.
 */
export const formatRevisionDisplayNumber = (version: string): string => {
  if (isUnofficialDocumentVersion(version)) {
    return String(getUnofficialVersionPatch(version) + 1).padStart(2, '0');
  }

  if (isOfficialDocumentVersion(version)) {
    return String(getOfficialVersionMajor(version)).padStart(2, '0');
  }

  return version;
};

export const formatRevisionDisplayLabel = (version: string): string =>
  `REV. ${formatRevisionDisplayNumber(version)}`;
