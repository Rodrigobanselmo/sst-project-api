/** Normaliza rótulos do seletor (ex.: "+ 1.0.0"). */
export const normalizeDocumentVersion = (version: string): string =>
  version.replace('+ ', '').trim();

/** Versão de teste / não oficial: 0.0.N */
export const isUnofficialDocumentVersion = (version: string): boolean => {
  const normalized = normalizeDocumentVersion(version);
  return /^0\.0\.\d+$/.test(normalized);
};

/** Versão oficial / controlada: N.0.0 com N >= 1 */
export const isOfficialDocumentVersion = (version: string): boolean => {
  const normalized = normalizeDocumentVersion(version);
  return /^[1-9]\d*\.0\.0$/.test(normalized);
};

/** Alias legado — preferir isOfficialDocumentVersion */
export const isRevisionControlledDocumentVersion = isOfficialDocumentVersion;

export type DocumentVersionSeriesRow = {
  version: string;
  officialRevisionSeries?: number | null;
};

export const resolveOfficialRevisionSeries = (
  series: number | null | undefined,
): number => series ?? 1;

export const filterUnofficialVersions = <T extends { version: string }>(
  versions: T[],
): T[] => versions.filter((version) => isUnofficialDocumentVersion(version.version));

export const filterOfficialVersions = <T extends { version: string }>(
  versions: T[],
): T[] => versions.filter((version) => isOfficialDocumentVersion(version.version));

export const filterOfficialVersionsBySeries = <T extends DocumentVersionSeriesRow>(
  versions: T[],
  activeOfficialSeries: number,
): T[] =>
  filterOfficialVersions(versions).filter(
    (version) =>
      resolveOfficialRevisionSeries(version.officialRevisionSeries) ===
      activeOfficialSeries,
  );

/** Alias legado — preferir filterOfficialVersions */
export const filterRevisionControlledVersions = filterOfficialVersions;

export const getUnofficialVersionPatch = (version: string): number => {
  const normalized = normalizeDocumentVersion(version);
  const match = normalized.match(/^0\.0\.(\d+)$/);
  return match ? Number(match[1]) : -1;
};

export const getOfficialVersionMajor = (version: string): number => {
  const normalized = normalizeDocumentVersion(version);
  const match = normalized.match(/^([1-9]\d*)\.0\.0$/);
  return match ? Number(match[1]) : -1;
};

export const getNextUnofficialVersion = (
  versions: { version: string }[],
): string => {
  const unofficial = filterUnofficialVersions(versions);
  if (unofficial.length === 0) return '0.0.0';

  const maxPatch = Math.max(
    ...unofficial.map((v) => getUnofficialVersionPatch(v.version)),
  );

  return `0.0.${maxPatch + 1}`;
};

export const getNextOfficialVersion = (
  versions: DocumentVersionSeriesRow[],
  activeOfficialSeries = 1,
): string => {
  const official = filterOfficialVersionsBySeries(
    versions,
    activeOfficialSeries,
  );

  if (official.length === 0) return '1.0.0';

  const maxMajor = Math.max(
    ...official.map((v) => getOfficialVersionMajor(v.version)),
  );

  return `${maxMajor + 1}.0.0`;
};

export const sortUnofficialVersionsByPatch = <T extends { version: string }>(
  versions: T[],
): T[] =>
  [...versions].sort(
    (a, b) =>
      getUnofficialVersionPatch(a.version) -
      getUnofficialVersionPatch(b.version),
  );

export const sortOfficialVersionsByMajor = <T extends { version: string }>(
  versions: T[],
): T[] =>
  [...versions].sort(
    (a, b) =>
      getOfficialVersionMajor(a.version) - getOfficialVersionMajor(b.version),
  );
