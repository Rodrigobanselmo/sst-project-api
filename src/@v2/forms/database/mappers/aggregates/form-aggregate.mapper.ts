import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { FormQuestionDataEntityMapper, FormQuestionDataEntityMapperConstructor } from '../entities/form-question-data.mapper';
import { FormQuestionGroupEntityMapper, FormQuestionGroupEntityMapperConstructor } from '../entities/form-question-group.mapper';
import { FormQuestionOptionEntityMapper, FormQuestionOptionEntityMapperConstructor } from '../entities/form-question-option.mapper';
import { FormQuestionEntityMapper, FormQuestionEntityMapperConstructor } from '../entities/form-question.mapper';
import { FormEntityMapper, FormEntityMapperConstructor } from '../entities/form.mapper';

export type FormAggregateMapperConstructor = FormEntityMapperConstructor & {
  questions_groups: (FormQuestionGroupEntityMapperConstructor & {
    question_group_to_question: {
      question: FormQuestionEntityMapperConstructor & {
        question_data: FormQuestionDataEntityMapperConstructor & {
          options: FormQuestionOptionEntityMapperConstructor[];
        };
      };
    }[];
  })[];
};

export class FormAggregateMapper {
  static toAggregate(prisma: FormAggregateMapperConstructor): FormAggregate {
    return new FormAggregate({
      form: FormEntityMapper.toEntity(prisma),
      questionGroups: prisma.questions_groups.map((group) => {
        const questionGroupEntity = FormQuestionGroupEntityMapper.toEntity(group);
        const questions = group.question_group_to_question.map((groupToQuestion) => {
          const questionEntity = FormQuestionEntityMapper.toEntity(groupToQuestion.question);
          const questionData = FormQuestionDataEntityMapper.toEntity(groupToQuestion.question.question_data);

          return Object.assign(questionEntity, {
            data: questionData,
            options: FormQuestionOptionEntityMapper.toArray(groupToQuestion.question.question_data.options),
          });
        });

        return Object.assign(questionGroupEntity, { questions });
      }),
    });
  }

  static toArray(prisma: FormAggregateMapperConstructor[]) {
    return prisma.map((p: FormAggregateMapperConstructor) => FormAggregateMapper.toAggregate(p));
  }
}
