import { FormAnswerBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-answer-browse.model';
import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import {
  getStructuralIndicatorGroupingConfig,
  isStructuralIndicatorGroupingKey,
  StructuralIndicatorGroupingKey,
} from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/helpers/form-indicators-structural-grouping.config';
import {
  ParticipantGroupForIndicators,
} from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/helpers/build-participant-groups-for-indicators';

import { ConsolidatedIndicatorsNarrativeGroupingMode } from './consolidated-indicators-narrative-scope.types';

export const CONSOLIDATED_NARRATIVE_COMPANY_GROUPING_KEY = '__consolidated_company';

const CONSOLIDATED_PARTICIPANTS_PRIVACY_MIN_SIZE = 3;

export function shouldProtectConsolidatedNarrativeGroup(count: number) {
  return count > 0 && count < CONSOLIDATED_PARTICIPANTS_PRIVACY_MIN_SIZE;
}

function buildCompanyParticipantGroups(
  participantStructures: FormQuestionsAnswersBrowseModel['participantStructures'],
): ParticipantGroupForIndicators[] {
  const groupsMap = new Map<string, ParticipantGroupForIndicators>();

  for (const structure of participantStructures) {
    const companyId = structure.companyId ?? '__none__';
    const companyName = structure.companyName?.trim() || 'Sem empresa';
    const groupId = `${CONSOLIDATED_NARRATIVE_COMPANY_GROUPING_KEY}::${companyId}`;

    let group = groupsMap.get(groupId);
    if (!group) {
      group = {
        id: groupId,
        name: companyName,
        participantIds: new Set<string>(),
      };
      groupsMap.set(groupId, group);
    }

    group.participantIds.add(structure.participantsAnswersId);
  }

  return Array.from(groupsMap.values())
    .filter((group) => group.participantIds.size > 0)
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

function buildStructuralParticipantGroups(params: {
  participantStructures: FormQuestionsAnswersBrowseModel['participantStructures'];
  groupingKey: StructuralIndicatorGroupingKey;
}): ParticipantGroupForIndicators[] {
  const config = getStructuralIndicatorGroupingConfig(params.groupingKey);
  if (!config) return [];

  const groupsMap = new Map<string, ParticipantGroupForIndicators>();

  for (const structure of params.participantStructures) {
    const { groupId, groupName } = config.resolveGroup(structure);
    let group = groupsMap.get(groupId);

    if (!group) {
      group = {
        id: groupId,
        name: groupName,
        participantIds: new Set<string>(),
      };
      groupsMap.set(groupId, group);
    }

    group.participantIds.add(structure.participantsAnswersId);
  }

  return Array.from(groupsMap.values())
    .filter((group) => group.participantIds.size > 0)
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

function buildIdentificationParticipantGroups(params: {
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
  questionId: string;
}): ParticipantGroupForIndicators[] {
  const [identifierGroup] = params.formQuestionsAnswers.results;
  const groupingQuestion = identifierGroup?.questions.find(
    (question) => question.id === params.questionId,
  );

  if (!groupingQuestion) return [];

  const groupsMap = new Map<string, ParticipantGroupForIndicators>();

  for (const answer of groupingQuestion.answers) {
    for (const optionId of answer.selectedOptionsIds) {
      const option = groupingQuestion.options.find((item) => item.id === optionId);
      if (!option) continue;

      const groupId = `question:${params.questionId}::${optionId}`;
      let group = groupsMap.get(groupId);

      if (!group) {
        group = {
          id: groupId,
          name: option.text.replace(/<[^>]*>?/g, '').trim() || '—',
          participantIds: new Set<string>(),
        };
        groupsMap.set(groupId, group);
      }

      group.participantIds.add(answer.participantsAnswersId);
    }
  }

  return Array.from(groupsMap.values())
    .filter((group) => group.participantIds.size > 0)
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
}

export function buildConsolidatedParticipantGroupsForNarrative(params: {
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
  groupingMode: ConsolidatedIndicatorsNarrativeGroupingMode;
}): ParticipantGroupForIndicators[] {
  if (params.groupingMode === 'overview') {
    const participantIds = new Set(
      params.formQuestionsAnswers.participantStructures.map(
        (structure) => structure.participantsAnswersId,
      ),
    );

    return [
      {
        id: 'overview',
        name: 'Visão geral consolidada',
        participantIds,
      },
    ];
  }

  if (params.groupingMode === CONSOLIDATED_NARRATIVE_COMPANY_GROUPING_KEY) {
    return buildCompanyParticipantGroups(
      params.formQuestionsAnswers.participantStructures,
    );
  }

  if (isStructuralIndicatorGroupingKey(params.groupingMode)) {
    return buildStructuralParticipantGroups({
      participantStructures: params.formQuestionsAnswers.participantStructures,
      groupingKey: params.groupingMode,
    });
  }

  if (params.groupingMode.startsWith('question:')) {
    const questionId = params.groupingMode.replace('question:', '');
    return buildIdentificationParticipantGroups({
      formQuestionsAnswers: params.formQuestionsAnswers,
      questionId,
    });
  }

  return [];
}

export function filterAnswersByParticipantIds(
  answers: FormAnswerBrowseModel[],
  participantIds: Set<string> | null,
) {
  if (!participantIds) return answers;

  return answers.filter((answer) => participantIds.has(answer.participantsAnswersId));
}
