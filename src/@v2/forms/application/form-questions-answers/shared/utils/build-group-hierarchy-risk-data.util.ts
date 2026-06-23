import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { IFormQuestionsAnswersRisksService } from '../services/form-questions-answers-risks.types';
import { IAiAnalyzeFormQuestionsRisksUseCase } from '../../ai-analyze-form-questions-risks/use-cases/ai-analyze-form-questions-risks.types';
import {
  buildQuestionsForHierarchyRisk,
  collectRiskIdsForGroup,
  resolveGroupReferenceRiskSummary,
} from './merge-group-hierarchy-risk-summary.util';

type AvailableRiskMap = Map<
  string,
  IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData
>;

function pickCanonicalMemberId(
  formData: IFormQuestionsAnswersRisksService.Result,
  memberHierarchyIds: string[],
): string | null {
  const sorted = [...memberHierarchyIds].sort((a, b) =>
    (formData.hierarchyMap[a]?.name ?? a).localeCompare(
      formData.hierarchyMap[b]?.name ?? b,
      'pt-BR',
      { sensitivity: 'base' },
    ),
  );

  return sorted.find((id) => Boolean(formData.hierarchyMap[id])) ?? null;
}

/**
 * Monta um job agregado por agrupamento + risco (uma entrada por grupo, não por setor).
 */
export function buildGroupHierarchyRiskDataList(params: {
  formData: IFormQuestionsAnswersRisksService.Result;
  availableRisksMap: AvailableRiskMap;
  minOccupationalRiskLevel: number;
}): IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] {
  const { formData, availableRisksMap, minOccupationalRiskLevel } = params;
  const groupJobs: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] = [];

  for (const group of formData.hierarchyGroups) {
    const riskIds = collectRiskIdsForGroup(formData, group);

    for (const riskId of riskIds) {
      const risk = formData.riskMap[riskId];
      const availableRisk = availableRisksMap.get(riskId);
      if (!risk || !availableRisk) continue;

      const referenceSummary = resolveGroupReferenceRiskSummary(
        formData,
        group,
        riskId,
      );
      if (!referenceSummary) continue;

      const groupedProbability =
        formData.groupedEntityRiskMap[group.id]?.[riskId]?.probability ?? 0;
      if (groupedProbability === 0) continue;

      const nro = getMatrizRisk(availableRisk.severity, groupedProbability);
      if (nro < minOccupationalRiskLevel) continue;

      const canonicalHierarchyId = pickCanonicalMemberId(
        formData,
        group.hierarchyIds,
      );
      if (!canonicalHierarchyId) continue;

      const canonicalHierarchy = formData.hierarchyMap[canonicalHierarchyId];
      if (!canonicalHierarchy) continue;

      const questions = buildQuestionsForHierarchyRisk(
        group.id,
        riskId,
        risk.name,
        referenceSummary,
        groupedProbability,
      );
      if (questions.length === 0) continue;

      const memberNames = group.hierarchyIds
        .map((id) => formData.hierarchyMap[id]?.name)
        .filter((name): name is string => Boolean(name));

      groupJobs.push({
        hierarchyId: canonicalHierarchyId,
        hierarchyName: group.name,
        hierarchyType: canonicalHierarchy.type,
        riskId,
        riskName: risk.name,
        riskType: risk.type,
        probability: groupedProbability,
        questions,
        probabilitySource: 'hierarchy_group',
        hierarchyGroupId: group.id,
        hierarchyGroupName: group.name,
        analysisScope: 'hierarchy_group',
        memberHierarchyIds: [...group.hierarchyIds],
        memberHierarchyNames: memberNames,
      });
    }
  }

  return groupJobs;
}
