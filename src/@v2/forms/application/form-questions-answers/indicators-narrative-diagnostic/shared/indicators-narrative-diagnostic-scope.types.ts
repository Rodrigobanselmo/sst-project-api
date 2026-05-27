export type IndicatorsNarrativeDiagnosticScope = {
  groupingQuestionId: string | null;
  participantGroupIds: string[];
  groupingLabel?: string | null;
  showOnlyGroupIndicators: boolean;
};

/** Evita Boolean('false') === true (comum com query strings e implicit conversion). */
export const parseShowOnlyGroupIndicators = (value: unknown): boolean => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value == null) return false;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'sim'].includes(normalized)) return true;
    if (['false', '0', 'no', 'não', 'nao', ''].includes(normalized)) return false;
  }

  return false;
};

export const normalizeIndicatorsNarrativeDiagnosticScope = (
  scope: Partial<IndicatorsNarrativeDiagnosticScope> & {
    showOnlyGroupIndicators?: unknown;
  },
): IndicatorsNarrativeDiagnosticScope => {
  const participantGroupIds = Array.from(
    new Set((scope.participantGroupIds ?? []).map((id) => String(id).trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const groupingQuestionId = scope.groupingQuestionId?.trim()
    ? scope.groupingQuestionId.trim()
    : null;

  const groupingLabel = scope.groupingLabel?.trim() ? scope.groupingLabel.trim() : null;

  return {
    groupingQuestionId,
    participantGroupIds,
    groupingLabel,
    showOnlyGroupIndicators: parseShowOnlyGroupIndicators(scope.showOnlyGroupIndicators),
  };
};

export const buildIndicatorsNarrativeScopeKey = (
  scope: IndicatorsNarrativeDiagnosticScope,
): string => {
  const groupingPart = scope.groupingQuestionId ?? '_all_';
  const groupsPart =
    scope.participantGroupIds.length > 0
      ? [...scope.participantGroupIds].sort().join('|')
      : '_all_groups_';
  const viewPart = scope.showOnlyGroupIndicators ? 'groups_only' : 'groups_and_questions';

  return `${groupingPart}::${groupsPart}::view::${viewPart}`;
};

export const indicatorsNarrativeScopeViewSuffix = (
  showOnlyGroupIndicators: boolean,
): 'groups_only' | 'groups_and_questions' =>
  showOnlyGroupIndicators ? 'groups_only' : 'groups_and_questions';
