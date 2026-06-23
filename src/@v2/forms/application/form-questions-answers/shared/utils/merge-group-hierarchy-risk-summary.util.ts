import { IFormQuestionsAnswersRisksService } from '../services/form-questions-answers-risks.types';
import { IAiAnalyzeFormQuestionsRisksUseCase } from '../../ai-analyze-form-questions-risks/use-cases/ai-analyze-form-questions-risks.types';

/**
 * Agrega perguntas/valores de todos os membros do grupo que possuem dado direto
 * para o mesmo riskId (equivalente ao merge usado em groupedHierarchyRiskMap).
 */
export function mergeGroupMemberRiskSummary(
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

export function collectRiskIdsForGroup(
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

export function resolveGroupReferenceRiskSummary(
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

export function buildQuestionsForHierarchyRisk(
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

export function buildHierarchyToGroupMap(
  hierarchyGroups: IFormQuestionsAnswersRisksService.HierarchyGroupData[],
): Map<string, IFormQuestionsAnswersRisksService.HierarchyGroupData> {
  const map = new Map<string, IFormQuestionsAnswersRisksService.HierarchyGroupData>();

  for (const group of hierarchyGroups) {
    for (const hierarchyId of group.hierarchyIds) {
      map.set(hierarchyId, group);
    }
  }

  return map;
}
