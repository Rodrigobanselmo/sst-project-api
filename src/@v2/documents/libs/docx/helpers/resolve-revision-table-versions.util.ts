import { DocumentBaseModel } from '@/@v2/documents/domain/models/document-base.model';
import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { VersionModel } from '@/@v2/documents/domain/models/version.model';
import {
  filterOfficialVersionsBySeries,
  filterUnofficialVersions,
  getOfficialVersionMajor,
  getUnofficialVersionPatch,
  isOfficialDocumentVersion,
  isUnofficialDocumentVersion,
  resolveOfficialRevisionSeries,
  sortOfficialVersionsByMajor,
  sortUnofficialVersionsByPatch,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';

const toVersionRowFromDocumentVersion = (
  documentVersion: DocumentVersionModel,
  documentBase: DocumentBaseModel,
): VersionModel =>
  new VersionModel({
    version: documentVersion.version,
    description: documentVersion.description,
    documentDate: documentVersion.documentDate,
    createdAt: documentVersion.createdAt,
    approvedBy: documentVersion.approvedBy ?? documentBase.approvedBy,
    revisionBy: documentVersion.revisionBy ?? documentBase.revisionBy,
    elaboratedBy: documentVersion.elaboratedBy ?? documentBase.elaboratedBy,
    officialRevisionSeries: documentVersion.officialRevisionSeries,
  });

/**
 * Monta as linhas da tabela de revisões do DOCX em geração, por família/série:
 * - 0.0.x: histórico acumulado da série de teste até a versão atual
 * - N.0.0: histórico apenas da série oficial correspondente
 */
export const resolveRevisionTableVersions = (
  documentVersion: DocumentVersionModel,
  documentBase: DocumentBaseModel,
): VersionModel[] => {
  const currentRow = toVersionRowFromDocumentVersion(
    documentVersion,
    documentBase,
  );

  if (isUnofficialDocumentVersion(documentVersion.version)) {
    const currentPatch = getUnofficialVersionPatch(documentVersion.version);
    const history = sortUnofficialVersionsByPatch(
      filterUnofficialVersions(documentBase.allVersions).filter(
        (version) =>
          version.version !== documentVersion.version &&
          getUnofficialVersionPatch(version.version) <= currentPatch,
      ),
    );

    return [...history, currentRow];
  }

  if (isOfficialDocumentVersion(documentVersion.version)) {
    const currentSeries = resolveOfficialRevisionSeries(
      documentVersion.officialRevisionSeries,
    );
    const currentMajor = getOfficialVersionMajor(documentVersion.version);
    const history = sortOfficialVersionsByMajor(
      filterOfficialVersionsBySeries(
        documentBase.allVersions,
        currentSeries,
      ).filter(
        (version) =>
          version.version !== documentVersion.version &&
          getOfficialVersionMajor(version.version) <= currentMajor,
      ),
    );

    return [...history, currentRow];
  }

  return [currentRow];
};
