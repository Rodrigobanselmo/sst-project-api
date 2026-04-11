import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { getParticiantAnswersStatus } from '@/@v2/forms/domain/utils/get-particiant-answers-status';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { FormIdentifierTypeEnum, HierarchyEnum, Prisma } from '@prisma/client';
import { IFormQuestionsAnswersRisksService } from './form-questions-answers-risks.types';

@Injectable()
export class FormQuestionsAnswersRisksService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  private readonly questionSelect = {
    select: {
      id: true,
      question_details: {
        select: {
          form_question_risk: {
            select: {
              risk: {
                select: {
                  id: true,
                  name: true,
                  severity: true,
                  type: true,
                  subTypes: {
                    select: {
                      sub_type: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          data: {
            where: { deleted_at: null },
            select: {
              question_identifier: {
                select: {
                  type: true,
                },
              },
              text: true,
              type: true,
            },
          },
          options: {
            select: {
              id: true,
              data: {
                where: { deleted_at: null },
                select: {
                  value: true,
                  text: true,
                },
              },
            },
          },
        },
      },
    },
  } satisfies Prisma.FormQuestionGroup$questionsArgs;

  private readonly hierarchyTypeIdentifierMap: Record<FormIdentifierTypeEnum, HierarchyEnum | null> = {
    [FormIdentifierTypeEnum.DIRECTORY]: HierarchyEnum.DIRECTORY,
    [FormIdentifierTypeEnum.MANAGEMENT]: HierarchyEnum.MANAGEMENT,
    [FormIdentifierTypeEnum.SECTOR]: HierarchyEnum.SECTOR,
    [FormIdentifierTypeEnum.SUB_SECTOR]: HierarchyEnum.SUB_SECTOR,
    [FormIdentifierTypeEnum.OFFICE]: HierarchyEnum.OFFICE,
    [FormIdentifierTypeEnum.SUB_OFFICE]: HierarchyEnum.SUB_OFFICE,
    [FormIdentifierTypeEnum.EMAIL]: null,
    [FormIdentifierTypeEnum.CPF]: null,
    [FormIdentifierTypeEnum.AGE]: null,
    [FormIdentifierTypeEnum.SEX]: null,
    [FormIdentifierTypeEnum.WORKSPACE]: null,
    [FormIdentifierTypeEnum.CUSTOM]: null,
  };

  async getFormQuestionsAnswersRisks(params: IFormQuestionsAnswersRisksService.Params): Promise<IFormQuestionsAnswersRisksService.Result> {
    const formApplication = await this.prisma.formApplication.findFirst({
      select: { status: true },
      where: {
        id: params.formApplicationId,
        company_id: params.companyId,
        deleted_at: null,
      },
    });
    if (!formApplication) throw new NotFoundException('Formulário não encontrado');

    const questionsAnswers = await this.prisma.formApplication.findFirst({
      where: {
        id: params.formApplicationId,
        company_id: params.companyId,
        deleted_at: null,
      },
      select: {
        form: {
          select: {
            questions_groups: {
              select: {
                questions: this.questionSelect,
              },
            },
          },
        },
        participants_answers: {
          where: {
            status: getParticiantAnswersStatus(FormStatusEnum[formApplication.status]),
          },
          select: {
            id: true,
            answers: {
              select: {
                value: true,
                question_id: true,
                options: {
                  select: {
                    option_id: true,
                  },
                },
              },
            },
          },
        },
        question_identifier_group: {
          select: {
            questions: this.questionSelect,
          },
        },
      },
    });

    if (!questionsAnswers) throw new NotFoundException('Formulário não encontrado');

    const questionMap = new Map<string, IFormQuestionsAnswersRisksService.QuestionData>();
    const optionMap = new Map<string, IFormQuestionsAnswersRisksService.OptionData>();

    const type = questionsAnswers.question_identifier_group[0].questions[0].question_details.data[0].question_identifier?.type;
    if (!type) throw new BadRequestException('Tipo de identificador de questão não encontrado');

    const hierarchyType = this.hierarchyTypeIdentifierMap[type];
    if (!hierarchyType) throw new BadRequestException('Tipo de identificador hierárquico de questão não encontrado');

    // Build question and option maps
    questionsAnswers.question_identifier_group.forEach((questionGroup) => {
      questionGroup.questions.forEach((question) => {
        const questionData: IFormQuestionsAnswersRisksService.QuestionData = {
          id: question.id,
          text: question.question_details.data[0]?.text || '',
          risks: question.question_details.form_question_risk.map((fqr) => fqr.risk),
          options: question.question_details.options.map((opt) => ({
            id: opt.id,
            data: opt.data.map((d) => ({
              text: d.text,
              value: d.value?.toString() || '',
            })),
          })),
        };
        questionMap.set(question.id, questionData);
      });
    });

    const hierarchy = await this.prisma.hierarchy.findMany({
      where: {
        companyId: params.companyId,
        type: hierarchyType,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    const hierarchyMap: Record<string, IFormQuestionsAnswersRisksService.HierarchyData> = {};
    hierarchy.forEach((h) => {
      hierarchyMap[h.id] = h;
    });

    questionsAnswers.form.questions_groups.forEach((questionGroup) => {
      questionGroup.questions.forEach((question) => {
        const questionData: IFormQuestionsAnswersRisksService.QuestionData = {
          id: question.id,
          text: question.question_details.data[0]?.text || '',
          risks: question.question_details.form_question_risk.map((fqr) => fqr.risk),
          options: question.question_details.options.map((opt) => ({
            id: opt.id,
            data: opt.data.map((d) => ({
              text: d.text,
              value: d.value?.toString() || '',
            })),
          })),
        };
        questionMap.set(question.id, questionData);

        question.question_details.options.forEach((option) => {
          optionMap.set(option.id, {
            id: option.id,
            data: option.data.map((d) => ({
              text: d.text,
              value: d.value?.toString() || '',
            })),
          });
        });
      });
    });

    // Process participant answers with detailed question information
    const participantAnswersMap = new Map<string, IFormQuestionsAnswersRisksService.ParticipantAnswerData>();

    questionsAnswers.participants_answers.forEach((participantAnswer) => {
      // Find hierarchy from any answer that has a hierarchy value
      let participantHierarchy: IFormQuestionsAnswersRisksService.HierarchyData | undefined;

      participantAnswer.answers.forEach((answer) => {
        if (!answer.value) return;
        const hierarchy = hierarchyMap[answer.value];
        if (hierarchy) {
          participantHierarchy = hierarchy;
          return;
        }
      });

      if (!participantHierarchy) return;

      const questionAnswersMap = new Map<string, IFormQuestionsAnswersRisksService.QuestionAnswerData>();

      // Process each answer with detailed question and option information
      participantAnswer.answers.forEach((answer) => {
        const question = questionMap.get(answer.question_id);
        if (!question) return;

        const selectedOptions = answer.options.map((option) => optionMap.get(option.option_id)).filter(Boolean) as IFormQuestionsAnswersRisksService.OptionData[];

        if (selectedOptions.length === 0) return;

        // Calculate numeric values from options
        const numericValues = selectedOptions
          .flatMap((option) => option.data)
          .map((data) => Number(data.value))
          .filter((value) => !isNaN(value) && value > 0);

        if (numericValues.length === 0) return;

        const averageValue = numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length;

        questionAnswersMap.set(answer.question_id, {
          question,
          selectedOptions,
          numericValues,
          averageValue,
          textValues: selectedOptions.flatMap((option) => option.data.map((data) => data.text)).filter(Boolean),
        });
      });

      participantAnswersMap.set(participantAnswer.id, {
        participantId: participantAnswer.id,
        hierarchy: participantHierarchy,
        questionAnswers: Array.from(questionAnswersMap.values()),
      });
    });

    // Build hierarchy-risk aggregation for summary data
    const hierarchyRiskMap: Record<string, Record<string, IFormQuestionsAnswersRisksService.HierarchyRiskSummary>> = {};

    const riskMap: Record<string, IFormQuestionsAnswersRisksService.RiskData> = {};

    participantAnswersMap.forEach((participantData) => {
      const hierarchyId = participantData.hierarchy.id;

      if (!hierarchyRiskMap[hierarchyId]) {
        hierarchyRiskMap[hierarchyId] = {};
      }

      participantData.questionAnswers.forEach((questionAnswer) => {
        questionAnswer.question.risks.forEach((risk) => {
          const riskId = risk.id;
          riskMap[riskId] = risk;

          if (!hierarchyRiskMap[hierarchyId][riskId]) {
            hierarchyRiskMap[hierarchyId][riskId] = {
              riskId,
              values: [],
              questions: [],
              probability: 0,
            };
          }

          // Add the average value for this question-participant combination
          if (questionAnswer.averageValue > 0) {
            hierarchyRiskMap[hierarchyId][riskId].values.push(questionAnswer.averageValue);
          }

          // Add question details if not already present
          const existingQuestion = hierarchyRiskMap[hierarchyId][riskId].questions.find((q) => q.questionId === questionAnswer.question.id);

          if (!existingQuestion) {
            hierarchyRiskMap[hierarchyId][riskId].questions.push({
              questionId: questionAnswer.question.id,
              questionText: questionAnswer.question.text,
              values: [questionAnswer.averageValue],
            });
          } else {
            existingQuestion.values.push(questionAnswer.averageValue);
          }
        });
      });
    });

    // Add empty hierarchy entries for hierarchies without risk data
    hierarchy.forEach((h) => {
      if (!hierarchyRiskMap[h.id]) {
        hierarchyRiskMap[h.id] = {};
      }
    });

    // Calculate final probabilities for each hierarchy-risk combination
    Object.keys(hierarchyRiskMap).forEach((hierarchyId) => {
      Object.keys(hierarchyRiskMap[hierarchyId]).forEach((riskId) => {
        const riskData = hierarchyRiskMap[hierarchyId][riskId];
        if (riskData.values.length > 0) {
          const averageValue = riskData.values.reduce((acc, val) => acc + val, 0) / riskData.values.length;
          riskData.probability = Math.ceil(averageValue);
        }

        // Calculate averages for individual questions
        riskData.questions.forEach((question) => {
          if (question.values.length > 0) {
            question.averageValue = question.values.reduce((acc, val) => acc + val, 0) / question.values.length;
          }
        });
      });
    });

    // Fetch hierarchy groups for this form application
    const hierarchyGroupsRaw = await this.prisma.formApplicationHierarchyGroup.findMany({
      where: { form_application_id: params.formApplicationId },
      include: { hierarchies: { select: { hierarchy_id: true } } },
    });

    // Build group mappings
    const hierarchyToGroupMap: Record<string, string> = {};
    const groupInfoMap: Record<string, { name: string; hierarchyIds: string[] }> = {};

    hierarchyGroupsRaw.forEach((group) => {
      const hIds = group.hierarchies.map((h) => h.hierarchy_id);
      groupInfoMap[group.id] = { name: group.name, hierarchyIds: hIds };
      hIds.forEach((hId) => {
        hierarchyToGroupMap[hId] = group.id;
      });
    });

    // Build grouped hierarchy-risk map (merges grouped hierarchies into single entities)
    const groupedHierarchyRiskMap: Record<string, Record<string, IFormQuestionsAnswersRisksService.HierarchyRiskSummary>> = {};

    Object.keys(hierarchyRiskMap).forEach((hierarchyId) => {
      const groupId = hierarchyToGroupMap[hierarchyId];
      const targetId = groupId || hierarchyId;

      if (!groupedHierarchyRiskMap[targetId]) {
        groupedHierarchyRiskMap[targetId] = {};
      }

      Object.entries(hierarchyRiskMap[hierarchyId]).forEach(([riskId, data]) => {
        if (!groupedHierarchyRiskMap[targetId][riskId]) {
          groupedHierarchyRiskMap[targetId][riskId] = {
            riskId,
            values: [...data.values],
            questions: data.questions.map((q) => ({ ...q, values: [...q.values] })),
            probability: 0,
          };
        } else {
          groupedHierarchyRiskMap[targetId][riskId].values.push(...data.values);
          // Merge questions
          data.questions.forEach((question) => {
            const existing = groupedHierarchyRiskMap[targetId][riskId].questions.find((q) => q.questionId === question.questionId);
            if (existing) {
              existing.values.push(...question.values);
            } else {
              groupedHierarchyRiskMap[targetId][riskId].questions.push({ ...question, values: [...question.values] });
            }
          });
        }
      });
    });

    // Recalculate probabilities for grouped map
    Object.keys(groupedHierarchyRiskMap).forEach((targetId) => {
      Object.keys(groupedHierarchyRiskMap[targetId]).forEach((riskId) => {
        const riskData = groupedHierarchyRiskMap[targetId][riskId];
        if (riskData.values.length > 0) {
          const averageValue = riskData.values.reduce((acc, val) => acc + val, 0) / riskData.values.length;
          riskData.probability = Math.ceil(averageValue);
        }
        riskData.questions.forEach((question) => {
          if (question.values.length > 0) {
            question.averageValue = question.values.reduce((acc, val) => acc + val, 0) / question.values.length;
          }
        });
      });
    });

    // Build grouped entity map
    const groupedEntityMap: Record<string, IFormQuestionsAnswersRisksService.GroupedEntityData> = {};

    hierarchy.forEach((h) => {
      if (!hierarchyToGroupMap[h.id]) {
        groupedEntityMap[h.id] = { id: h.id, name: h.name, type: h.type };
      }
    });

    Object.entries(groupInfoMap).forEach(([groupId, info]) => {
      groupedEntityMap[groupId] = { id: groupId, name: info.name, type: 'GROUP' };
    });

    const hierarchyGroupsResult: IFormQuestionsAnswersRisksService.HierarchyGroupData[] = hierarchyGroupsRaw.map((g) => ({
      id: g.id,
      name: g.name,
      hierarchyIds: g.hierarchies.map((h) => h.hierarchy_id),
    }));

    return {
      hierarchyRiskMap,
      hierarchyMap,
      riskMap,
      participantAnswers: Array.from(participantAnswersMap.values()),
      // Individual sector data (used in risk analysis to list each sector separately)
      entityRiskMap: Object.fromEntries(
        Object.entries(hierarchyRiskMap).map(([hierarchyId, risks]) => [
          hierarchyId,
          Object.fromEntries(Object.entries(risks).map(([riskId, riskData]) => [riskId, { values: riskData.values, probability: riskData.probability }])),
        ]),
      ),
      entityMap: hierarchyMap,
      // Grouped data (merged sectors shown as single entities in indicators/PDF)
      groupedEntityRiskMap: Object.fromEntries(
        Object.entries(groupedHierarchyRiskMap).map(([targetId, risks]) => [
          targetId,
          Object.fromEntries(Object.entries(risks).map(([riskId, riskData]) => [riskId, { values: riskData.values, probability: riskData.probability }])),
        ]),
      ),
      groupedEntityMap,
      hierarchyGroups: hierarchyGroupsResult,
    };
  }
}
