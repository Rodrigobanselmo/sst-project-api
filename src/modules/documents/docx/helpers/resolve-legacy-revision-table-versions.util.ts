import {
  filterOfficialVersionsBySeries,
  getOfficialVersionMajor,
  getUnofficialVersionPatch,
  isOfficialDocumentVersion,
  isUnofficialDocumentVersion,
  resolveOfficialRevisionSeries,
  sortOfficialVersionsByMajor,
  sortUnofficialVersionsByPatch,
} from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import { RiskDocumentEntity } from '@/modules/sst/entities/riskDocument.entity';

/** Monta linhas da tabela de revisões no builder legado (versão atual em versions[0]). */
export const resolveLegacyRevisionTableVersions = (
  versions: RiskDocumentEntity[],
): RiskDocumentEntity[] => {
  const current = versions[0];
  if (!current) return [];

  if (isUnofficialDocumentVersion(current.version)) {
    const currentPatch = getUnofficialVersionPatch(current.version);
    const history = sortUnofficialVersionsByPatch(
      versions.filter(
        (version) =>
          version.version !== current.version &&
          isUnofficialDocumentVersion(version.version) &&
          getUnofficialVersionPatch(version.version) <= currentPatch,
      ),
    );

    return [...history, current];
  }

  if (isOfficialDocumentVersion(current.version)) {
    const currentSeries = resolveOfficialRevisionSeries(
      current.officialRevisionSeries,
    );
    const currentMajor = getOfficialVersionMajor(current.version);
    const history = sortOfficialVersionsByMajor(
      filterOfficialVersionsBySeries(versions, currentSeries).filter(
        (version) =>
          version.version !== current.version &&
          getOfficialVersionMajor(version.version) <= currentMajor,
      ),
    );

    return [...history, current];
  }

  return [current];
};
