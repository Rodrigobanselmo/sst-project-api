export type RiskNarrativeDiagnosticScope = {
  groupingQuestionId: string | null;
  participantGroupIds: string[];
  allowedHierarchyIds: string[] | null;
  groupingLabel?: string | null;
};

export const buildRiskNarrativeScopeKey = (scope: RiskNarrativeDiagnosticScope): string => {
  const groupingPart = scope.groupingQuestionId ?? '_all_';
  const groupsPart =
    scope.participantGroupIds.length > 0
      ? [...scope.participantGroupIds].sort().join('|')
      : '_all_groups_';
  const hierarchiesPart =
    scope.allowedHierarchyIds && scope.allowedHierarchyIds.length > 0
      ? [...scope.allowedHierarchyIds].sort().join('|')
      : '_all_hierarchies_';

  return `${groupingPart}::${groupsPart}::${hierarchiesPart}`;
};
