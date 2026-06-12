import { parseShowOnlyGroupIndicators } from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/shared/indicators-narrative-diagnostic-scope.types';

export type ConsolidatedIndicatorsNarrativeGroupingMode =
  | 'overview'
  | '__consolidated_company'
  | '__participant_workspace'
  | '__participant_sector'
  | '__participant_directory'
  | '__participant_management'
  | `question:${string}`;

export type ConsolidatedIndicatorsNarrativeScope = {
  groupingMode: ConsolidatedIndicatorsNarrativeGroupingMode;
  participantGroupIds: string[];
  groupingLabel?: string | null;
  showOnlyGroupIndicators: boolean;
};

export const normalizeConsolidatedIndicatorsNarrativeScope = (
  scope: Partial<ConsolidatedIndicatorsNarrativeScope> & {
    showOnlyGroupIndicators?: unknown;
  },
): ConsolidatedIndicatorsNarrativeScope => {
  const groupingMode = (scope.groupingMode?.trim() ||
    'overview') as ConsolidatedIndicatorsNarrativeGroupingMode;

  const participantGroupIds = Array.from(
    new Set((scope.participantGroupIds ?? []).map((id) => String(id).trim()).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right, 'pt-BR'));

  return {
    groupingMode,
    participantGroupIds,
    groupingLabel: scope.groupingLabel?.trim() ? scope.groupingLabel.trim() : null,
    showOnlyGroupIndicators: parseShowOnlyGroupIndicators(scope.showOnlyGroupIndicators),
  };
};

export const buildConsolidatedIndicatorsNarrativeScopeKey = (params: {
  companyGroupId: number;
  applicationIds: string[];
  scope: ConsolidatedIndicatorsNarrativeScope;
}): string => {
  const appsPart = [...new Set(params.applicationIds)].sort().join('|');
  const groupsPart =
    params.scope.participantGroupIds.length > 0
      ? params.scope.participantGroupIds.join('|')
      : '_all_groups_';
  const viewPart = params.scope.showOnlyGroupIndicators
    ? 'groups_only'
    : 'groups_and_questions';

  return `consolidated::cg${params.companyGroupId}::apps::${appsPart}::mode::${params.scope.groupingMode}::groups::${groupsPart}::view::${viewPart}`;
};

export const getConsolidatedIndicatorsNarrativeStorageAnchor = (params: {
  applicationIds: string[];
}) => {
  const sortedApplicationIds = [...new Set(params.applicationIds)].sort();
  return sortedApplicationIds[0] ?? '';
};
