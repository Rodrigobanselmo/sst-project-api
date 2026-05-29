import { IFormQuestionsAnswersRisksService } from '../services/form-questions-answers-risks.types';

export type EffectiveRiskProbabilitySource = 'individual' | 'hierarchy_group';

export type ResolveEffectiveRiskProbabilityParams = {
  hierarchyId: string;
  riskId: string;
  entityRiskMap: IFormQuestionsAnswersRisksService.Result['entityRiskMap'];
  groupedEntityRiskMap: IFormQuestionsAnswersRisksService.Result['groupedEntityRiskMap'];
  hierarchyGroups: IFormQuestionsAnswersRisksService.Result['hierarchyGroups'];
  /** Used when entityRiskMap has no entry for the pair (e.g. hierarchyRiskMap fallback). */
  individualProbabilityFallback?: number;
};

export type ResolveEffectiveRiskProbabilityResult = {
  probability: number;
  source: EffectiveRiskProbabilitySource;
  groupId?: string;
  groupName?: string;
};

export function resolveEffectiveRiskProbability(
  params: ResolveEffectiveRiskProbabilityParams,
): ResolveEffectiveRiskProbabilityResult {
  const {
    hierarchyId,
    riskId,
    entityRiskMap,
    groupedEntityRiskMap,
    hierarchyGroups,
    individualProbabilityFallback = 0,
  } = params;

  const group = hierarchyGroups.find((g) => g.hierarchyIds.includes(hierarchyId));
  if (group) {
    const groupedProbability = groupedEntityRiskMap[group.id]?.[riskId]?.probability;
    if (groupedProbability != null) {
      return {
        probability: groupedProbability,
        source: 'hierarchy_group',
        groupId: group.id,
        groupName: group.name,
      };
    }
  }

  const individual =
    entityRiskMap[hierarchyId]?.[riskId]?.probability ?? individualProbabilityFallback;

  return {
    probability: individual,
    source: 'individual',
  };
}
