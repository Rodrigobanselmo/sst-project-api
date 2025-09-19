import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { getParticiantAnswersStatus } from '@/@v2/forms/domain/utils/get-particiant-answers-status';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FormIdentifierTypeEnum, HierarchyEnum, Prisma } from '@prisma/client';
import { IBrowseFormQuestionsAnswersRisksUseCase } from './browse-form-questions-answers-risks.types';

@Injectable()
export class BrowseFormQuestionsAnswersRisksUseCase {
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
            select: {
              question_identifier: {
                select: {
                  type: true,
                },
              },
            },
          },
          options: {
            select: {
              id: true,
              data: {
                where: { deleted_at: null },
                select: {
                  value: true,
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

  async execute(params: IBrowseFormQuestionsAnswersRisksUseCase.Params): Promise<IBrowseFormQuestionsAnswersRisksUseCase.Result> {
    const formApplication = await this.prisma.formApplication.findFirst({
      select: { status: true },
      where: {
        id: params.formApplicationId,
        company_id: params.companyId,
      },
    });
    if (!formApplication) throw new NotFoundException('Formulário não encontrado');

    const questionsAnswers = await this.prisma.formApplication.findFirst({
      where: {
        id: params.formApplicationId,
        company_id: params.companyId,
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

    const questionMap = new Map<string, (typeof questionsAnswers.question_identifier_group)[0]['questions'][0]>();
    const optionMap = new Map<string, (typeof questionsAnswers.question_identifier_group)[0]['questions'][0]['question_details']['options'][0]>();

    const type = questionsAnswers.question_identifier_group[0].questions[0].question_details.data[0].question_identifier?.type;
    if (!type) throw new BadRequestException('Tipo de identificador de questão não encontrado');

    const hierarchyType = this.hierarchyTypeIdentifierMap[type];
    if (!hierarchyType) throw new BadRequestException('Tipo de identificador hierárquico de questão não encontrado');

    questionsAnswers.question_identifier_group.forEach((questionGroup) => {
      questionGroup.questions.forEach((question) => {
        questionMap.set(question.id, question);
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

    const hierarchyMap: Record<string, (typeof hierarchy)[0]> = {};

    hierarchy.forEach((hierarchy) => {
      hierarchyMap[hierarchy.id] = hierarchy;
    });

    questionsAnswers.form.questions_groups.forEach((questionGroup) => {
      questionGroup.questions.forEach((question) => {
        questionMap.set(question.id, question);
        question.question_details.options.forEach((option) => {
          optionMap.set(option.id, option);
        });
      });
    });

    // Create the final structure: {participantId: {hierarchy, answers: [{question, options[]}]}}
    const participantAnswersMap = new Map<
      string,
      {
        hierarchy: (typeof hierarchy)[0];
        answers: {
          question: (typeof questionsAnswers.question_identifier_group)[0]['questions'][0];
          options: (typeof questionsAnswers.question_identifier_group)[0]['questions'][0]['question_details']['options'];
        }[];
      }
    >();

    questionsAnswers.participants_answers.forEach((participantAnswer) => {
      // First, find hierarchy from any answer that has a hierarchy value
      participantAnswer.answers.forEach((answer) => {
        if (!answer.value) return;
        const hierarchy = hierarchyMap[answer.value];
        if (hierarchy) {
          participantAnswersMap.set(participantAnswer.id, {
            hierarchy: hierarchy,
            answers: [],
          });
          return;
        }
      });

      const questionAnswersMap = new Map<
        string,
        {
          question: (typeof questionsAnswers.question_identifier_group)[0]['questions'][0];
          options: (typeof questionsAnswers.question_identifier_group)[0]['questions'][0]['question_details']['options'];
        }
      >();

      // find the question and options for each answer
      participantAnswer.answers.forEach((answer) => {
        const question = questionMap.get(answer.question_id);
        if (!question) return;

        const options = answer.options.map((option) => optionMap.get(option.option_id)!);
        if (options.length === 0) return;

        if (!questionAnswersMap.has(answer.question_id)) {
          questionAnswersMap.set(answer.question_id, {
            question,
            options: [],
          });
        }

        const questionAnswer = questionAnswersMap.get(answer.question_id);
        if (!questionAnswer) return;

        questionAnswer.options.push(...options);
      });

      const participantAnswers = participantAnswersMap.get(participantAnswer.id);
      if (!participantAnswers) return;

      participantAnswers.answers = Array.from(questionAnswersMap.values());
    });

    // Extract hierarchyRisks from participantAnswersMap
    const hierarchyRiskMap: Record<
      string,
      Record<
        string,
        {
          values: number[];
          probability: number;
        }
      >
    > = {};

    const riskMap: Record<string, (typeof questionsAnswers.question_identifier_group)[0]['questions'][0]['question_details']['form_question_risk'][0]['risk']> = {};

    participantAnswersMap.forEach((participantData) => {
      const hierarchyId = participantData.hierarchy.id;

      if (!hierarchyRiskMap[hierarchyId]) {
        hierarchyRiskMap[hierarchyId] = {};
      }

      participantData.answers.forEach((answerData) => {
        // Check if question has associated risks
        if (answerData.question.question_details.form_question_risk) {
          answerData.question.question_details.form_question_risk.forEach((formQuestionRisk) => {
            const riskId = formQuestionRisk.risk.id;

            // Extract values from options
            const values = answerData.options
              .map((option) => option.data?.[0]?.value)
              .filter(Boolean)
              .map((value) => Number(value));

            if (values.length === 0) return;

            if (!hierarchyRiskMap[hierarchyId][riskId]) {
              riskMap[riskId] = formQuestionRisk.risk;
              hierarchyRiskMap[hierarchyId][riskId] = {
                values: [],
                probability: 0,
              };
            }

            // Add values to existing array
            const averageValue = values.reduce((acc, value) => acc + value, 0) / values.length;
            if (isNaN(averageValue) || averageValue === 0) return;
            hierarchyRiskMap[hierarchyId][riskId].values.push(averageValue);
          });
        }
      });
    });

    // Add all hierarchy on hierarchyRisks that are empty
    hierarchy.forEach((hierarchy) => {
      if (!hierarchyRiskMap[hierarchy.id]) {
        hierarchyRiskMap[hierarchy.id] = {};
      }
    });

    // add average value to hierarchyRiskMap values for each risk
    Object.keys(hierarchyRiskMap).forEach((hierarchyId) => {
      Object.keys(hierarchyRiskMap[hierarchyId]).forEach((riskId) => {
        const averageValue = hierarchyRiskMap[hierarchyId][riskId].values.reduce((acc, value) => acc + value, 0) / hierarchyRiskMap[hierarchyId][riskId].values.length;
        hierarchyRiskMap[hierarchyId][riskId].probability = Math.ceil(averageValue);
      });
    });

    return { entityRiskMap: hierarchyRiskMap, riskMap, entityMap: hierarchyMap };
  }
}
