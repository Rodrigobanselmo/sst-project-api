import { FormAggregateRepository } from '@/@v2/forms/database/repositories/form/form-aggregate.repository';
import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { FormQuestionDataEntity } from '@/@v2/forms/domain/entities/form-question-data.entity';
import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormEntity } from '@/@v2/forms/domain/entities/form.entity';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IAddFormUseCase } from './add-form.types';

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
          order: groupIndex + 1,
          formId: formEntity.id,
        });

        const questionsAggregate = group.questions.map((question, questionIndex) => {
          const questionEntity = new FormQuestionEntity({
            required: question.required,
            order: questionIndex + 1,
          });

          const questionDataEntity = new FormQuestionDataEntity({
            text: question.data.text,
            type: question.data.type,
            acceptOther: question.data.acceptOther,
            companyId: params.companyId,
            system: loggedUser.isAdmin,
          });

          const optionsAggregate = question.options?.map((option, optionIndex) => {
            return new FormQuestionOptionEntity({
              text: option.text,
              order: optionIndex + 1,
              value: option.value,
            });
          });

          return {
            ...questionEntity,
            data: questionDataEntity,
            options: questionDataEntity.needsOptions ? optionsAggregate : [],
          };
        });

        return {
          ...questionGroupEntity,
          questions: questionsAggregate,
        };
      }) || [];

    const formAggregate = new FormAggregate({
      form: formEntity,
      questionGroups: questionGroupsAggregate,
    });

    const createdFormAggregate = await this.formAggregateRepository.create(formAggregate);

    return createdFormAggregate;
  }
}
