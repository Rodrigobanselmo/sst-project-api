import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormAnswerBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-answer-browse.model';
import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import {
  buildParticipantGroupingForIndicators,
  type HierarchyGroupForIndicators,
  type ParticipantGroupForIndicators,
} from './build-participant-groups-for-indicators';

type QuestionForIndicator = {
  id: string;
  groupId: string;
  groupName: string;
  details: { id: string; text: string; type: FormQuestionTypeEnum };
  options: { id: string; text: string; value?: number; order: number }[];
  answers: FormAnswerBrowseModel[];
};

type QuestionWithParticipantGroups = Omit<QuestionForIndicator, 'answers'> & {
  participantGroupData: Array<{
    groupId: string;
    groupName: string;
    participantCount: number;
    question: QuestionForIndicator;
  }>;
};

export type IndicatorRowPayload = {
  participantGroupId: string;
  participantGroupName: string;
  participantCount: number;
  score: number;
  percentage: number;
  hasValidAnswers: boolean;
  shouldHideData: boolean;
};

export type IndicatorsNarrativePayload = {
  showOnlyGroupIndicators: boolean;
  isShareableLink: boolean;
  grouping:
    | { active: false }
    | { active: true; questionId: string; questionLabel: string };
  participantGroups: Array<{
    id: string;
    name: string;
    participantCount: number;
  }>;
  formGroups: Array<{
    groupId: string;
    groupName: string;
    indicators: IndicatorRowPayload[];
    questions?: Array<{
      questionId: string;
      questionLabel: string;
      indicators: IndicatorRowPayload[];
    }>;
  }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/g, '').trim();
}

const filterAnswersByParticipants = (
  answers: FormAnswerBrowseModel[],
  participantIds: Set<string> | null,
) => {
  if (!participantIds) return answers;
  return answers.filter((answer) => participantIds.has(answer.participantsAnswersId));
};

export const buildQuestionsWithOptions = (
  groups: FormQuestionsAnswersBrowseModel['results'],
  filteredParticipantIds?: Set<string> | null,
): QuestionForIndicator[] => {
  return groups.flatMap((group) =>
    group.questions
      .filter(
        (question) =>
          question.options.length > 0 &&
          [
            FormQuestionTypeEnum.RADIO,
            FormQuestionTypeEnum.CHECKBOX,
            FormQuestionTypeEnum.SELECT,
          ].includes(question.details.type),
      )
      .map((question) => ({
        id: question.id,
        groupId: group.id,
        groupName: group.name,
        details: question.details,
        options: question.options.map((option) => ({
          ...option,
          value: option.value ? 6 - option.value : option.value,
        })),
        answers: filteredParticipantIds
          ? filterAnswersByParticipants(question.answers, filteredParticipantIds)
          : question.answers,
      })),
  );
};

export const calculateIndicatorForQuestions = (
  questions: QuestionWithParticipantGroups[],
  participantGroupId?: string,
) => {
  let totalValue = 0;
  let totalAnswers = 0;

  questions.forEach((questionData) => {
    const questionsToAggregate = participantGroupId
      ? ([
          questionData.participantGroupData.find((pg) => pg.groupId === participantGroupId)
            ?.question,
        ].filter(Boolean) as QuestionForIndicator[])
      : questionData.participantGroupData.map((pg) => pg.question);

    questionsToAggregate.forEach((q) => {
      q.answers.forEach((answer) => {
        answer.selectedOptionsIds.forEach((optionId) => {
          const option = questionData.options.find((opt) => opt.id === optionId);
          if (option && option.value !== undefined && option.value > 0) {
            totalValue += option.value - 1;
            totalAnswers += 1;
          }
        });
      });
    });
  });

  if (totalAnswers === 0) return { score: 0, percentage: 0, hasValidAnswers: false };

  const maxPossibleValue = totalAnswers * 4;
  const score = maxPossibleValue > 0 ? totalValue / maxPossibleValue : 0;
  const percentage = Math.round(score * 100);

  return { score, percentage, hasValidAnswers: true };
};

export function buildIndicatorsNarrativePayload(params: {
  formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
  selectedGroupingQuestionId: string | null;
  showOnlyGroupIndicators: boolean;
  isShareableLink: boolean;
  hierarchyGroups?: HierarchyGroupForIndicators[];
  visibleParticipantGroupIds?: string[];
}): IndicatorsNarrativePayload {
  const {
    formQuestionsAnswers,
    selectedGroupingQuestionId,
    showOnlyGroupIndicators,
    isShareableLink,
    hierarchyGroups = [],
    visibleParticipantGroupIds,
  } = params;

  let { grouping, participantGroups } = buildParticipantGroupingForIndicators({
    formQuestionsAnswers,
    selectedGroupingQuestionId,
    hierarchyGroups,
  });

  if (grouping.active && visibleParticipantGroupIds !== undefined) {
    const allow = new Set(visibleParticipantGroupIds);
    participantGroups = participantGroups.filter((g) => allow.has(g.id));
  }

  const [, ...generalGroups] = formQuestionsAnswers.results;

  const generalQuestionsArrays = participantGroups.map((group) => ({
    groupId: group.id,
    groupName: group.name,
    participantCount: group.participantIds.size,
    questions: buildQuestionsWithOptions(generalGroups, group.participantIds),
  }));

  const allQuestions = new Map<string, QuestionWithParticipantGroups>();

  generalQuestionsArrays.forEach((participantGroup) => {
    participantGroup.questions.forEach((question) => {
      const key = `${question.groupId}-${question.id}`;
      if (!allQuestions.has(key)) {
        allQuestions.set(key, {
          id: question.id,
          groupId: question.groupId,
          groupName: question.groupName,
          details: question.details,
          options: question.options,
          participantGroupData: [],
        });
      }

      allQuestions.get(key)!.participantGroupData.push({
        groupId: participantGroup.groupId,
        groupName: participantGroup.groupName,
        participantCount: participantGroup.participantCount,
        question,
      });
    });
  });

  const questionsByFormGroup = Array.from(allQuestions.values()).reduce(
    (acc, questionData) => {
      const groupKey = questionData.groupId;
      if (!acc[groupKey]) {
        acc[groupKey] = {
          groupId: questionData.groupId,
          groupName: questionData.groupName,
          questions: [] as QuestionWithParticipantGroups[],
        };
      }
      acc[groupKey].questions.push(questionData);
      return acc;
    },
    {} as Record<
      string,
      {
        groupId: string;
        groupName: string;
        questions: QuestionWithParticipantGroups[];
      }
    >,
  );

  const hasMultipleParticipantGroups =
    grouping.active && participantGroups.length > 1;

  const formGroups = Object.values(questionsByFormGroup).map((fg) => {
    const indicators = (
      hasMultipleParticipantGroups ? participantGroups : [participantGroups[0]]
    ).map((pg) => {
      const { score, percentage, hasValidAnswers } = calculateIndicatorForQuestions(
        fg.questions,
        hasMultipleParticipantGroups ? pg.id : undefined,
      );
      const participantCount = pg.participantIds.size;
      const shouldHideData = !isShareableLink && participantCount < 3;
      return {
        participantGroupId: pg.id,
        participantGroupName: pg.name,
        participantCount,
        score,
        percentage,
        hasValidAnswers,
        shouldHideData,
      };
    });

    const questions = showOnlyGroupIndicators
      ? undefined
      : fg.questions.map((q) => ({
          questionId: q.id,
          questionLabel: stripHtml(q.details.text),
          indicators: (hasMultipleParticipantGroups
            ? participantGroups
            : [participantGroups[0]]
          ).map((pg) => {
            const { score, percentage, hasValidAnswers } = calculateIndicatorForQuestions(
              [q],
              hasMultipleParticipantGroups ? pg.id : undefined,
            );
            const participantCount = pg.participantIds.size;
            const shouldHideData = !isShareableLink && participantCount < 3;
            return {
              participantGroupId: pg.id,
              participantGroupName: pg.name,
              participantCount,
              score,
              percentage,
              hasValidAnswers,
              shouldHideData,
            };
          }),
        }));

    return {
      groupId: fg.groupId,
      groupName: fg.groupName,
      indicators,
      ...(questions ? { questions } : {}),
    };
  });

  return {
    showOnlyGroupIndicators,
    isShareableLink,
    grouping,
    participantGroups: participantGroups.map((pg) => ({
      id: pg.id,
      name: pg.name,
      participantCount: pg.participantIds.size,
    })),
    formGroups,
  };
}

export function countVisibleIndicatorRows(payload: IndicatorsNarrativePayload): number {
  let count = 0;
  for (const fg of payload.formGroups) {
    for (const row of fg.indicators) {
      if (row.hasValidAnswers && !row.shouldHideData) count += 1;
    }
    if (payload.showOnlyGroupIndicators) continue;
    for (const q of fg.questions ?? []) {
      for (const row of q.indicators) {
        if (row.hasValidAnswers && !row.shouldHideData) count += 1;
      }
    }
  }
  return count;
}

function formatIndicatorRow(row: IndicatorRowPayload): string {
  if (row.shouldHideData) {
    return `  - ${row.participantGroupName} (n=${row.participantCount}): [OCULTO POR SIGILO — menos de 3 participantes]`;
  }
  if (!row.hasValidAnswers) {
    return `  - ${row.participantGroupName} (n=${row.participantCount}): sem respostas válidas para cálculo`;
  }
  return `  - ${row.participantGroupName} (n=${row.participantCount}): ${row.percentage}% (score ${row.score.toFixed(3)})`;
}

export function formatIndicatorsNarrativePayloadToText(
  payload: IndicatorsNarrativePayload,
  meta: {
    formApplicationName?: string;
    formModelName?: string;
    groupingLabel?: string | null;
  },
): string {
  const lines: string[] = [];

  lines.push('DADOS OBJETIVOS DO SIMPLESST — ABA INDICADORES (NÃO RECALCULAR)');
  if (meta.formApplicationName) {
    lines.push(`Formulário / aplicação: ${meta.formApplicationName}`);
  }
  if (meta.formModelName) {
    lines.push(`Modelo: ${meta.formModelName}`);
  }

  lines.push(
    `Modo de visualização: ${payload.showOnlyGroupIndicators ? 'apenas construtos/sessões (grupos)' : 'construtos/sessões + perguntas'}`,
  );

  if (payload.grouping.active) {
    lines.push(
      `Recorte por agrupamento: ${meta.groupingLabel ?? payload.grouping.questionLabel}`,
    );
    lines.push(`Grupos no recorte: ${payload.participantGroups.map((g) => g.name).join('; ')}`);
  } else {
    lines.push('Recorte: todos os participantes (sem agrupamento por identificação)');
  }

  lines.push('');
  lines.push('FAIXAS DE INTERPRETAÇÃO (referência do sistema):');
  lines.push('0–19% muito negativo | 20–39% negativo | 40–59% neutro | 60–79% positivo | 80–100% muito positivo');
  lines.push('');
  lines.push('---');
  lines.push('');

  if (payload.formGroups.length === 0) {
    lines.push('Nenhum construto/sessão com indicadores calculáveis no recorte.');
    return lines.join('\n');
  }

  for (const fg of payload.formGroups) {
    lines.push(`## Sessão/Construto: ${fg.groupName}`);
    lines.push('Indicadores agregados da sessão:');
    fg.indicators.forEach((row) => lines.push(formatIndicatorRow(row)));

    if (!payload.showOnlyGroupIndicators && fg.questions?.length) {
      lines.push('Perguntas da sessão:');
      for (const q of fg.questions) {
        lines.push(`### Pergunta: ${q.questionLabel}`);
        q.indicators.forEach((row) => lines.push(formatIndicatorRow(row)));
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}
