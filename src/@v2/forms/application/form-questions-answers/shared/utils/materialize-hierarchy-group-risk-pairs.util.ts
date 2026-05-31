import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';
import { IFormQuestionsAnswersRisksService } from '../services/form-questions-answers-risks.types';
import { IAiAnalyzeFormQuestionsRisksUseCase } from '../../ai-analyze-form-questions-risks/use-cases/ai-analyze-form-questions-risks.types';
import { resolveEffectiveRiskProbability } from './resolve-effective-risk-probability.util';

type AvailableRiskMap = Map<
  string,
  IAiAnalyzeFormQuestionsRisksUseCase.AvailableRiskData
>;

function buildPairKey(hierarchyId: string, riskId: string): string {
  return `${hierarchyId}:${riskId}`;
}

/**
 * Agrega perguntas/valores de todos os membros do grupo que possuem dado direto
 * para o mesmo riskId (equivalente ao merge usado em groupedHierarchyRiskMap).
 */
function mergeGroupMemberRiskSummary(
  hierarchyRiskMap: IFormQuestionsAnswersRisksService.Result['hierarchyRiskMap'],
  memberHierarchyIds: string[],
  riskId: string,
): IFormQuestionsAnswersRisksService.HierarchyRiskSummary | null {
  const mergedQuestions = new Map<
    string,
    IFormQuestionsAnswersRisksService.QuestionSummary
  >();
  const mergedValues: number[] = [];

  for (const memberId of memberHierarchyIds) {
    const summary = hierarchyRiskMap[memberId]?.[riskId];
    if (!summary) continue;

    mergedValues.push(...summary.values);

    for (const question of summary.questions) {
      const existing = mergedQuestions.get(question.questionId);
      if (existing) {
        existing.values.push(...question.values);
      } else {
        mergedQuestions.set(question.questionId, {
          ...question,
          values: [...question.values],
        });
      }
    }
  }

  if (mergedQuestions.size === 0 && mergedValues.length === 0) {
    return null;
  }

  const questions = Array.from(mergedQuestions.values()).map((question) => {
    if (question.values.length === 0) return question;

    const averageValue =
      question.values.reduce((acc, val) => acc + val, 0) / question.values.length;

    return {
      ...question,
      averageValue,
    };
  });

  return {
    riskId,
    values: mergedValues,
    questions,
    probability: 0,
  };
}

function buildQuestionsForHierarchyRisk(
  hierarchyId: string,
  riskId: string,
  riskName: string,
  riskSummary: IFormQuestionsAnswersRisksService.HierarchyRiskSummary,
  effectiveProbability: number,
): IAiAnalyzeFormQuestionsRisksUseCase.QuestionData[] {
  const questions: IAiAnalyzeFormQuestionsRisksUseCase.QuestionData[] =
    riskSummary.questions.map((questionSummary) => ({
      id: questionSummary.questionId,
      text: questionSummary.questionText,
      probability: questionSummary.averageValue
        ? Math.ceil(questionSummary.averageValue)
        : 0,
      values: questionSummary.values,
    }));

  if (questions.length === 0 && riskSummary.values.length > 0) {
    questions.push({
      id: `${hierarchyId}-${riskId}-summary`,
      text: `Perguntas relacionadas ao risco ${riskName}`,
      probability: effectiveProbability,
      values: riskSummary.values,
    });
  }

  return questions;
}

function collectRiskIdsForGroup(
  formData: IFormQuestionsAnswersRisksService.Result,
  group: IFormQuestionsAnswersRisksService.HierarchyGroupData,
): Set<string> {
  const riskIds = new Set<string>();

  for (const riskId of Object.keys(formData.groupedEntityRiskMap[group.id] ?? {})) {
    riskIds.add(riskId);
  }

  for (const memberId of group.hierarchyIds) {
    for (const riskId of Object.keys(formData.hierarchyRiskMap[memberId] ?? {})) {
      riskIds.add(riskId);
    }
  }

  return riskIds;
}

function resolveGroupReferenceRiskSummary(
  formData: IFormQuestionsAnswersRisksService.Result,
  group: IFormQuestionsAnswersRisksService.HierarchyGroupData,
  riskId: string,
): IFormQuestionsAnswersRisksService.HierarchyRiskSummary | null {
  const mergedFromMembers = mergeGroupMemberRiskSummary(
    formData.hierarchyRiskMap,
    group.hierarchyIds,
    riskId,
  );

  if (mergedFromMembers) {
    return mergedFromMembers;
  }

  const groupedValues = formData.groupedEntityRiskMap[group.id]?.[riskId];
  if (!groupedValues?.values.length) {
    return null;
  }

  return {
    riskId,
    values: [...groupedValues.values],
    questions: [],
    probability: groupedValues.probability,
  };
}

export type MaterializeHierarchyGroupRiskPairsParams = {
  formData: IFormQuestionsAnswersRisksService.Result;
  availableRisksMap: AvailableRiskMap;
  existingPairKeys: Set<string>;
  /**
   * Pares abaixo deste NRO não são materializados (reduz jobs em FULL_INCREMENTAL).
   * filterEligibleHierarchyRiskData continua sendo a barreira final.
   */
  minOccupationalRiskLevel: number;
};

/**
 * Materializa pares risco/setor sintéticos para membros de hierarchyGroups que
 * aparecem na Análise de Riscos via agrupamento, mas não possuem entrada própria
 * em hierarchyRiskMap.
 *
 * Impacto em FULL_INCREMENTAL: cada membro de grupo com risco agregado Moderado+
 * passa a ser elegível como par próprio (até N membros × M riscos por grupo),
 * sujeito aos skips de análise completa e PROCESSING recente já existentes.
 */
export function materializeHierarchyGroupRiskPairs(
  params: MaterializeHierarchyGroupRiskPairsParams,
): IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] {
  const {
    formData,
    availableRisksMap,
    existingPairKeys,
    minOccupationalRiskLevel,
  } = params;

  const syntheticPairs: IAiAnalyzeFormQuestionsRisksUseCase.HierarchyRiskData[] =
    [];

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

      for (const hierarchyId of group.hierarchyIds) {
        const pairKey = buildPairKey(hierarchyId, riskId);
        if (existingPairKeys.has(pairKey)) continue;

        const hierarchy = formData.hierarchyMap[hierarchyId];
        if (!hierarchy) continue;

        const effective = resolveEffectiveRiskProbability({
          hierarchyId,
          riskId,
          entityRiskMap: formData.entityRiskMap,
          groupedEntityRiskMap: formData.groupedEntityRiskMap,
          hierarchyGroups: formData.hierarchyGroups,
          individualProbabilityFallback: referenceSummary.probability,
        });

        if (effective.probability === 0) continue;

        const nro = getMatrizRisk(availableRisk.severity, effective.probability);
        if (nro < minOccupationalRiskLevel) continue;

        const questions = buildQuestionsForHierarchyRisk(
          hierarchyId,
          riskId,
          risk.name,
          referenceSummary,
          effective.probability,
        );

        if (questions.length === 0) continue;

        existingPairKeys.add(pairKey);
        syntheticPairs.push({
          hierarchyId,
          hierarchyName: hierarchy.name,
          hierarchyType: hierarchy.type,
          riskId,
          riskName: risk.name,
          riskType: risk.type,
          probability: effective.probability,
          questions,
          probabilitySource: effective.source,
          hierarchyGroupId: effective.groupId,
          hierarchyGroupName: effective.groupName,
        });
      }
    }
  }

  return syntheticPairs;
}
