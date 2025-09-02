import { FormAggregateRepository } from '@/@v2/forms/database/repositories/form/form-aggregate.repository';
import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { FormQuestionDetailsEntity } from '@/@v2/forms/domain/entities/form-question-details.entity';
import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormQuestionRiskEntity } from '@/@v2/forms/domain/entities/form-question-risk.entity';
import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormEntity } from '@/@v2/forms/domain/entities/form.entity';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IAddFormUseCase } from './add-form.types';
import { FormQuestionGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-group.aggregate';
import { FormQuestionAggregate } from '@/@v2/forms/domain/aggregates/form-question.aggregate';

@Injectable()
export class AddFormUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly formAggregateRepository: FormAggregateRepository,
  ) {}

  async execute(params: IAddFormUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const formEntity = new FormEntity({
      companyId: params.companyId,
      name: params.name,
      description: params.description,
      type: params.type,
      anonymous: params.anonymous,
      shareableLink: params.shareableLink,
      system: loggedUser.isAdmin,
    });

    const questionGroupsAggregate =
      params.questionGroups?.map((group, groupIndex) => {
        const questionGroupEntity = new FormQuestionGroupEntity({
          name: group.name,
          description: group.description,
          order: groupIndex,
        });

        const questionsAggregate = group.questions.map((question, questionIndex) => {
          const questionEntity = new FormQuestionEntity({
            required: question.required,
            order: questionIndex,
            groupId: questionGroupEntity.id,
          });

          const detailsEntity = new FormQuestionDetailsEntity({
            text: question.details.text,
            type: question.details.type,
            acceptOther: question.details.acceptOther,
            companyId: params.companyId,
            system: loggedUser.isAdmin,
          });

          const optionsEntities: FormQuestionOptionEntity[] = [];
          if (detailsEntity.needsOptions) {
            question.options?.forEach((option, optionIndex) => {
              const optionEntity = new FormQuestionOptionEntity({
                text: option.text,
                order: optionIndex,
                value: option.value,
              });

              optionsEntities.push(optionEntity);
            });
          }

          const riskEntities: FormQuestionRiskEntity[] = [];
          if (question.details.riskIds) {
            question.details.riskIds.forEach((riskId) => {
              const riskEntity = new FormQuestionRiskEntity({
                questionId: detailsEntity.id,
                riskId: riskId,
              });

              riskEntities.push(riskEntity);
            });
          }

          return new FormQuestionAggregate({
            question: questionEntity,
            details: detailsEntity,
            options: optionsEntities,
            identifier: undefined,
            risks: riskEntities,
          });
        });

        return new FormQuestionGroupAggregate({
          questionGroup: questionGroupEntity,
          questions: questionsAggregate,
          form: formEntity,
        });
      }) || [];

    const formAggregate = new FormAggregate({
      form: formEntity,
      questionGroups: questionGroupsAggregate,
    });

    const createdFormAggregate = await this.formAggregateRepository.create(formAggregate);

    return createdFormAggregate;
  }
}
