import { FormQuestionsAnswersDAO } from '@/@v2/forms/database/dao/form-questions-answers/form-questions-answers.dao';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { IBrowseFormQuestionsAnswersUseCase } from './browse-form-questions-answers.types';

@Injectable()
export class BrowseFormQuestionsAnswersUseCase {
  constructor(
    private readonly formQuestionsAnswersDAO: FormQuestionsAnswersDAO,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: IBrowseFormQuestionsAnswersUseCase.Params) {
    const questionsAnswers = await this.formQuestionsAnswersDAO.browse({
      filters: {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        search: params.search,
      },
    });

    const hierarchies = await this.prisma.hierarchy.findMany({
      where: {
        companyId: params.companyId,
        type: HierarchyEnum.SECTOR,
      },
    });

    // Add random option to SYSTEM type questions
    questionsAnswers.results.forEach((group) => {
      group.questions.forEach((question) => {
        if (question.details.type === FormQuestionTypeEnum.SYSTEM) {
          // Add a random option to SYSTEM questions
          const options = hierarchies.map((hierarchy) => ({
            id: hierarchy.id,
            text: hierarchy.name,
            order: question.options.length,
          }));

          question.options.push(...options);

          question.answers.forEach((answer) => {
            answer.selectedOptionsIds.push(answer.value);
          });
        }
      });
    });

    return questionsAnswers;
  }
}
