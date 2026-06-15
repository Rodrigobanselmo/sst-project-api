import { Injectable } from '@nestjs/common';

import {
  buildQuestionsWithOptions,
  calculateIndicatorForQuestions,
  countVisibleIndicatorRows,
  IndicatorsNarrativePayload,
} from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/helpers/build-indicators-narrative-payload';
import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

import {
  buildConsolidatedParticipantGroupsForNarrative,
  shouldProtectConsolidatedNarrativeGroup,
} from '../utils/build-consolidated-participant-groups-for-narrative';
import { ConsolidatedIndicatorsNarrativeScope } from '../utils/consolidated-indicators-narrative-scope.types';

export type ConsolidatedIndicatorsNarrativeInputBuildResult = {
  content: Array<{ type: 'text'; text: string }>;
  summary: {
    formGroupCount: number;
    visibleIndicatorRows: number;
    protectedGroupCount: number;
    scope: ConsolidatedIndicatorsNarrativeScope;
  };
};

@Injectable()
export class BuildConsolidatedIndicatorsNarrativeInputService {
  build(params: {
    formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
    scope: ConsolidatedIndicatorsNarrativeScope;
    businessGroupName: string;
    formName: string;
    applicationCount: number;
    companyCount: number;
    totals: {
      totalParticipants: number;
      totalResponded: number;
      completionPercent: number;
    };
  }): ConsolidatedIndicatorsNarrativeInputBuildResult {
    let participantGroups = buildConsolidatedParticipantGroupsForNarrative({
      formQuestionsAnswers: params.formQuestionsAnswers,
      groupingMode: params.scope.groupingMode,
    });

    if (params.scope.participantGroupIds.length > 0) {
      const allowed = new Set(params.scope.participantGroupIds);
      participantGroups = participantGroups.filter((group) => allowed.has(group.id));
    }

    const protectedGroupCount = participantGroups.filter((group) =>
      shouldProtectConsolidatedNarrativeGroup(group.participantIds.size),
    ).length;

    const payload = this.buildPayload({
      formQuestionsAnswers: params.formQuestionsAnswers,
      scope: params.scope,
      participantGroups,
    });

    const text = this.formatPayloadToText(payload, {
      businessGroupName: params.businessGroupName,
      formName: params.formName,
      applicationCount: params.applicationCount,
      companyCount: params.companyCount,
      totals: params.totals,
      groupingLabel: params.scope.groupingLabel,
      protectedGroupCount,
    });

    return {
      content: [{ type: 'text', text }],
      summary: {
        formGroupCount: payload.formGroups.length,
        visibleIndicatorRows: countVisibleIndicatorRows(payload),
        protectedGroupCount,
        scope: params.scope,
      },
    };
  }

  private buildPayload(params: {
    formQuestionsAnswers: FormQuestionsAnswersBrowseModel;
    scope: ConsolidatedIndicatorsNarrativeScope;
    participantGroups: ReturnType<typeof buildConsolidatedParticipantGroupsForNarrative>;
  }): IndicatorsNarrativePayload {
    const { formQuestionsAnswers, scope, participantGroups } = params;
    const [, ...generalGroups] = formQuestionsAnswers.results;
    const isShareableLink = false;

    const generalQuestionsArrays = participantGroups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      participantCount: group.participantIds.size,
      questions: buildQuestionsWithOptions(generalGroups, group.participantIds),
    }));

    type QuestionWithParticipantGroups = {
      id: string;
      groupId: string;
      groupName: string;
      details: { id: string; text: string; type: FormQuestionTypeEnum };
      options: { id: string; text: string; value?: number; order: number }[];
      participantGroupData: Array<{
        groupId: string;
        groupName: string;
        participantCount: number;
        question: ReturnType<typeof buildQuestionsWithOptions>[number];
      }>;
    };

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
        if (!acc[questionData.groupId]) {
          acc[questionData.groupId] = {
            groupId: questionData.groupId,
            groupName: questionData.groupName,
            questions: [],
          };
        }
        acc[questionData.groupId].questions.push(questionData);
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

    const hasMultipleParticipantGroups = participantGroups.length > 1;
    const groupingActive = scope.groupingMode !== 'overview';

    const formGroups = Object.values(questionsByFormGroup).map((formGroup) => {
      const indicators = (
        hasMultipleParticipantGroups ? participantGroups : [participantGroups[0]]
      )
        .filter(Boolean)
        .map((participantGroup) => {
          const { score, percentage, hasValidAnswers } =
            calculateIndicatorForQuestions(
              formGroup.questions,
              hasMultipleParticipantGroups ? participantGroup.id : undefined,
            );
          const participantCount = participantGroup.participantIds.size;
          const shouldHideData = shouldProtectConsolidatedNarrativeGroup(participantCount);

          return {
            participantGroupId: participantGroup.id,
            participantGroupName: participantGroup.name,
            participantCount,
            score,
            percentage,
            hasValidAnswers,
            shouldHideData,
          };
        });

      const questions = scope.showOnlyGroupIndicators
        ? undefined
        : formGroup.questions.map((questionData) => ({
            questionId: questionData.id,
            questionLabel: questionData.details.text.replace(/<[^>]*>?/g, '').trim(),
            indicators: (hasMultipleParticipantGroups
              ? participantGroups
              : [participantGroups[0]]
            )
              .filter(Boolean)
              .map((participantGroup) => {
                const { score, percentage, hasValidAnswers } =
                  calculateIndicatorForQuestions(
                    [questionData],
                    hasMultipleParticipantGroups ? participantGroup.id : undefined,
                  );
                const participantCount = participantGroup.participantIds.size;
                const shouldHideData =
                  shouldProtectConsolidatedNarrativeGroup(participantCount);

                return {
                  participantGroupId: participantGroup.id,
                  participantGroupName: participantGroup.name,
                  participantCount,
                  score,
                  percentage,
                  hasValidAnswers,
                  shouldHideData,
                };
              }),
          }));

      return {
        groupId: formGroup.groupId,
        groupName: formGroup.groupName,
        indicators,
        ...(questions ? { questions } : {}),
      };
    });

    return {
      showOnlyGroupIndicators: scope.showOnlyGroupIndicators,
      isShareableLink,
      grouping: groupingActive
        ? {
            active: true,
            questionId: scope.groupingMode,
            questionLabel: scope.groupingLabel ?? scope.groupingMode,
          }
        : { active: false },
      participantGroups: participantGroups.map((group) => ({
        id: group.id,
        name: group.name,
        participantCount: group.participantIds.size,
      })),
      formGroups,
    };
  }

  private formatPayloadToText(
    payload: IndicatorsNarrativePayload,
    meta: {
      businessGroupName: string;
      formName: string;
      applicationCount: number;
      companyCount: number;
      totals: {
        totalParticipants: number;
        totalResponded: number;
        completionPercent: number;
      };
      groupingLabel?: string | null;
      protectedGroupCount: number;
    },
  ): string {
    const lines: string[] = [];

    lines.push('DADOS OBJETIVOS DO SIMPLESST — VISÃO CONSOLIDADA VIRTUAL (NÃO RECALCULAR)');
    lines.push(`Grupo empresarial: ${meta.businessGroupName}`);
    lines.push(`Modelo de formulário: ${meta.formName}`);
    lines.push(`Aplicações consolidadas: ${meta.applicationCount}`);
    lines.push(`Empresas no agrupamento: ${meta.companyCount}`);
    lines.push(
      `Participantes: ${meta.totals.totalParticipants} | Responderam: ${meta.totals.totalResponded} | Taxa: ${meta.totals.completionPercent}%`,
    );
    lines.push(
      `Modo de visualização: ${payload.showOnlyGroupIndicators ? 'apenas construtos/sessões (grupos)' : 'construtos/sessões + perguntas'}`,
    );

    if (payload.grouping.active) {
      lines.push(
        `Agrupamento selecionado: ${meta.groupingLabel ?? payload.grouping.questionLabel}`,
      );
      lines.push(
        `Subgrupos no agrupamento: ${payload.participantGroups.map((group) => group.name).join('; ')}`,
      );
    } else {
      lines.push('Agrupamento: visão geral consolidada (todas as aplicações elegíveis)');
    }

    lines.push('');
    lines.push(
      'REGRAS DE SIGILO: grupos com menos de 3 participantes estão marcados como [OCULTO POR SIGILO]. Não inferir nem estimar valores ocultos.',
    );
    if (meta.protectedGroupCount > 0) {
      lines.push(
        `Subgrupos ocultos por sigilo neste agrupamento: ${meta.protectedGroupCount}`,
      );
    }

    lines.push('');
    lines.push('FAIXAS DE INTERPRETAÇÃO (referência do sistema — use apenas para classificar os percentuais enviados):');
    lines.push(
      '0–19% muito negativo | 20–39% negativo | 40–59% neutro | 60–79% positivo | 80–100% muito positivo',
    );
    lines.push('');
    lines.push('INSTRUÇÕES PARA A NARRATIVA (OBRIGATÓRIO):');
    lines.push('- Interpretar os percentuais e scores enviados abaixo; não recalcular.');
    lines.push('- Não explicar genericamente o que é COPSOQ, FRPS ou outra metodologia.');
    lines.push('- Não descrever apenas a metodologia; focar nos resultados objetivos deste agrupamento.');
    lines.push('- Destacar achados prioritários com base nos valores fornecidos.');
    lines.push('- Apontar construtos/sessões mais críticos e mais favoráveis.');
    lines.push('- Comparar subgrupos do agrupamento somente quando houver dados suficientes e não protegidos.');
    lines.push('- Não gerar inventário/PGR, fonte geradora, probabilidade de risco, plano de ação ou medidas de controle específicas.');
    lines.push('');
    lines.push(
      'ESTRUTURA ESPERADA: Síntese executiva; Achados prioritários; Escalas/categorias com maior atenção; Diferenças relevantes entre subgrupos (se houver); Pontos de proteção/forças; Observações de sigilo e limitações; Orientações gerenciais gerais.',
    );
    lines.push('');
    lines.push('---');
    lines.push('');

    if (payload.formGroups.length === 0) {
      lines.push('Nenhum construto/sessão com indicadores calculáveis neste agrupamento.');
      return lines.join('\n');
    }

    for (const formGroup of payload.formGroups) {
      lines.push(`## Sessão/Construto: ${formGroup.groupName}`);
      lines.push('Indicadores agregados da sessão:');
      formGroup.indicators.forEach((row) => {
        if (row.shouldHideData) {
          lines.push(
            `  - ${row.participantGroupName} (n=${row.participantCount}): [OCULTO POR SIGILO — menos de 3 participantes]`,
          );
          return;
        }
        if (!row.hasValidAnswers) {
          lines.push(
            `  - ${row.participantGroupName} (n=${row.participantCount}): sem respostas válidas para cálculo`,
          );
          return;
        }
        lines.push(
          `  - ${row.participantGroupName} (n=${row.participantCount}): ${row.percentage}% (score ${row.score.toFixed(3)})`,
        );
      });

      if (!payload.showOnlyGroupIndicators && formGroup.questions?.length) {
        lines.push('Perguntas da sessão:');
        for (const question of formGroup.questions) {
          lines.push(`### Pergunta: ${question.questionLabel}`);
          question.indicators.forEach((row) => {
            if (row.shouldHideData) {
              lines.push(
                `  - ${row.participantGroupName} (n=${row.participantCount}): [OCULTO POR SIGILO — menos de 3 participantes]`,
              );
              return;
            }
            if (!row.hasValidAnswers) {
              lines.push(
                `  - ${row.participantGroupName} (n=${row.participantCount}): sem respostas válidas para cálculo`,
              );
              return;
            }
            lines.push(
              `  - ${row.participantGroupName} (n=${row.participantCount}): ${row.percentage}% (score ${row.score.toFixed(3)})`,
            );
          });
        }
      }

      lines.push('');
    }

    return lines.join('\n');
  }
}
