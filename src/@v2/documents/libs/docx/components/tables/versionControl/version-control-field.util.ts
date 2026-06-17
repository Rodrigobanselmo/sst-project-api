import { VersionControlFallback } from './version-control.types';

export function resolveVersionControlField(
  versionValue: string | null | undefined,
  versionKey: string,
  rowIndex: number,
  totalRows: number,
  fallbackValue: string | null | undefined,
  fallback?: VersionControlFallback,
): string {
  if (versionValue?.trim()) {
    return versionValue.trim();
  }

  if (!fallback) {
    return '';
  }

  const matchesCurrentVersion = versionKey === fallback.currentVersion;
  const isLatestVersion = rowIndex === totalRows - 1;

  if (matchesCurrentVersion || isLatestVersion) {
    return fallbackValue?.trim() || '';
  }

  return '';
}
