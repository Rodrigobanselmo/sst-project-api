import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { FormQuestionDataEntityMapper, FormQuestionDataEntityMapperConstructor } from '../entities/form-question-data.mapper';
import { FormQuestionGroupEntityMapper, FormQuestionGroupEntityMapperConstructor } from '../entities/form-question-group.mapper';
import { FormQuestionOptionEntityMapper, FormQuestionOptionEntityMapperConstructor } from '../entities/form-question-option.mapper';
import { FormQuestionEntityMapper, FormQuestionEntityMapperConstructor } from '../entities/form-question.mapper';
import { FormEntityMapper, FormEntityMapperConstructor } from '../entities/form.mapper';

export type FormAggregateMapperConstructor = FormEntityMapperConstructor & {
  questions_groups: (FormQuestionGroupEntityMapperConstructor & {
    questions: (FormQuestionEntityMapperConstructor & {
      question_data: FormQuestionDataEntityMapperConstructor & {
        options: FormQuestionOptionEntityMapperConstructor[];
      };
    })[];
  })[];
};

export class FormAggregateMapper {
  static toAggregate(prisma: FormAggregateMapperConstructor): FormAggregate {
    return new FormAggregate({
      form: FormEntityMapper.toEntity(prisma),
      questionGroups: prisma.questions_groups.map((group) => ({
        ...FormQuestionGroupEntityMapper.toEntity(group),
        questions: group.questions.map((question) => {
          const questionEntity = FormQuestionEntityMapper.toEntity(question);
          const questionData = FormQuestionDataEntityMapper.toEntity(question.question_data);

          return {
            ...questionEntity,
            data: questionData,
            options: FormQuestionOptionEntityMapper.toArray(question.question_data.options),
          };
        }),
      })),
    });
  }

  static toArray(prisma: FormAggregateMapperConstructor[]) {
    return prisma.map((p: FormAggregateMapperConstructor) => FormAggregateMapper.toAggregate(p));
  }
}
