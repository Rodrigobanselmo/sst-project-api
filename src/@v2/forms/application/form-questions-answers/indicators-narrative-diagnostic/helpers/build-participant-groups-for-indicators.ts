import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import {
  getStructuralIndicatorGroupingLabel,
  isStructuralIndicatorGroupingKey,
} from './form-indicators-structural-grouping.config';
import { buildStructuralParticipantGroupsForIndicators } from './build-structural-participant-groups-for-indicators';
import { resolveParticipantStructuresForGrouping } from './resolve-participant-structures-for-grouping';

export type HierarchyGroupForIndicators = {
  id: string;
  name: string;
  hierarchyIds: string[];
};

export type ParticipantGroupForIndicators = {
  id: string;
  name: string;
  participantIds: Set<string>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/g, '').trim();
}

function buildOptionToHierarchyMap(
  groupingQuestion: FormQuestionsAnswersBrowseModel['results'][number]['questions'][number],
): Map<string, string> {
  const map = new Map<string, string>();
  groupingQuestion.answers.forEach((answer) => {
    if (answer.value && answer.selectedOptionsIds.length > 0) {
      answer.selectedOptionsIds.forEach((optionId) => {
        if (!map.has(optionId)) {
          map.set(optionId, answer.value!);
        }
      });
    }
  });
  return map;
}

export function buildParticipantGroupsForIndicators(params: {
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
  selectedGroupingQuestionId: string | null;
  hierarchyGroups: HierarchyGroupForIndicators[];
}): ParticipantGroupForIndicators[] {
  const {
    formQuestionsAnswers,
    selectedGroupingQuestionId,
    hierarchyGroups = [],
  } = params;

  if (
    selectedGroupingQuestionId &&
    isStructuralIndicatorGroupingKey(selectedGroupingQuestionId)
  ) {
    return buildStructuralParticipantGroupsForIndicators({
      participantStructures: resolveParticipantStructuresForGrouping(formQuestionsAnswers),
      groupingKey: selectedGroupingQuestionId,
    });
  }

  const results = formQuestionsAnswers.results;
  const [identifierGroup] = results;

  if (!identifierGroup) {
    return [
      {
        id: 'all',
        name: 'Todos os participantes',
        participantIds: new Set(),
      },
    ];
  }

  const groupingQuestion = selectedGroupingQuestionId
    ? identifierGroup.questions.find((q) => q.id === selectedGroupingQuestionId)
    : null;

  if (!groupingQuestion) {
    const allParticipantIds = new Set<string>();
    identifierGroup.questions.forEach((question) => {
      question.answers.forEach((answer) => {
        allParticipantIds.add(answer.participantsAnswersId);
      });
    });
    return [
      {
        id: 'all',
        name: 'Todos os participantes',
        participantIds: allParticipantIds,
      },
    ];
  }

  const optionToHierarchyMap = buildOptionToHierarchyMap(groupingQuestion);

  type GroupWithHierarchy = ParticipantGroupForIndicators & {
    hierarchyId?: string;
  };

  const initialGroups: GroupWithHierarchy[] = groupingQuestion.options.map((option) => {
    const participantIds = new Set<string>();
    groupingQuestion.answers.forEach((answer) => {
      if (answer.selectedOptionsIds.includes(option.id)) {
        participantIds.add(answer.participantsAnswersId);
      }
    });
    return {
      id: option.id,
      name: option.text,
      participantIds,
      hierarchyId: optionToHierarchyMap.get(option.id),
    };
  });

  let merged: ParticipantGroupForIndicators[];

  if (!hierarchyGroups.length) {
    merged = initialGroups.map(({ id, name, participantIds }) => ({
      id,
      name,
      participantIds,
    }));
  } else {
    const hierarchyToGroupMap = new Map<string, { id: string; name: string }>();
    hierarchyGroups.forEach((hGroup) => {
      hGroup.hierarchyIds.forEach((hId) => {
        hierarchyToGroupMap.set(hId, { id: hGroup.id, name: hGroup.name });
      });
    });

    const mergedGroupsMap = new Map<
      string,
      { id: string; name: string; participantIds: Set<string> }
    >();

    initialGroups.forEach((group) => {
      const hId = group.hierarchyId;
      const hGroup = hId ? hierarchyToGroupMap.get(hId) : undefined;

      if (hGroup) {
        if (mergedGroupsMap.has(hGroup.id)) {
          const existing = mergedGroupsMap.get(hGroup.id)!;
          group.participantIds.forEach((pid) => existing.participantIds.add(pid));
        } else {
          mergedGroupsMap.set(hGroup.id, {
            id: hGroup.id,
            name: hGroup.name,
            participantIds: new Set(group.participantIds),
          });
        }
      } else {
        mergedGroupsMap.set(group.id, {
          id: group.id,
          name: group.name,
          participantIds: group.participantIds,
        });
      }
    });

    merged = Array.from(mergedGroupsMap.values());
  }

  return merged.filter((g) => g.participantIds.size > 0);
}

export type ParticipantGroupingForIndicators =
  | { active: false }
  | { active: true; questionId: string; questionLabel: string };

export function buildParticipantGroupingForIndicators(params: {
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
  selectedGroupingQuestionId: string | null;
  hierarchyGroups: HierarchyGroupForIndicators[];
}): {
  grouping: ParticipantGroupingForIndicators;
  participantGroups: ParticipantGroupForIndicators[];
} {
  const {
    formQuestionsAnswers,
    selectedGroupingQuestionId,
    hierarchyGroups = [],
  } = params;

  const [identifierGroup] = formQuestionsAnswers.results;

  if (!identifierGroup) {
    return {
      grouping: { active: false },
      participantGroups: [
        {
          id: 'all',
          name: 'Todos os participantes',
          participantIds: new Set(),
        },
      ],
    };
  }

  if (
    selectedGroupingQuestionId &&
    isStructuralIndicatorGroupingKey(selectedGroupingQuestionId)
  ) {
    const participantGroups = buildStructuralParticipantGroupsForIndicators({
      participantStructures: resolveParticipantStructuresForGrouping(formQuestionsAnswers),
      groupingKey: selectedGroupingQuestionId,
    });
    if (participantGroups.length === 0) {
      const allParticipantIds = new Set<string>();
      identifierGroup.questions.forEach((q) => {
        q.answers.forEach((answer) => {
          allParticipantIds.add(answer.participantsAnswersId);
        });
      });
      return {
        grouping: { active: false },
        participantGroups: [
          {
            id: 'all',
            name: 'Todos os participantes',
            participantIds: allParticipantIds,
          },
        ],
      };
    }
    return {
      grouping: {
        active: true,
        questionId: selectedGroupingQuestionId,
        questionLabel: getStructuralIndicatorGroupingLabel(selectedGroupingQuestionId),
      },
      participantGroups,
    };
  }

  const groupingQuestion = selectedGroupingQuestionId
    ? identifierGroup.questions.find((q) => q.id === selectedGroupingQuestionId)
    : null;

  if (!groupingQuestion) {
    const allParticipantIds = new Set<string>();
    identifierGroup.questions.forEach((q) => {
      q.answers.forEach((answer) => {
        allParticipantIds.add(answer.participantsAnswersId);
      });
    });
    return {
      grouping: { active: false },
      participantGroups: [
        {
          id: 'all',
          name: 'Todos os participantes',
          participantIds: allParticipantIds,
        },
      ],
    };
  }

  const participantGroups = buildParticipantGroupsForIndicators({
    formQuestionsAnswers,
    selectedGroupingQuestionId,
    hierarchyGroups,
  });

  if (participantGroups.length === 0) {
    const allParticipantIds = new Set<string>();
    identifierGroup.questions.forEach((q) => {
      q.answers.forEach((answer) => {
        allParticipantIds.add(answer.participantsAnswersId);
      });
    });
    return {
      grouping: { active: false },
      participantGroups: [
        {
          id: 'all',
          name: 'Todos os participantes',
          participantIds: allParticipantIds,
        },
      ],
    };
  }

  return {
    grouping: {
      active: true,
      questionId: groupingQuestion.id,
      questionLabel: stripHtml(groupingQuestion.details.text),
    },
    participantGroups,
  };
}
