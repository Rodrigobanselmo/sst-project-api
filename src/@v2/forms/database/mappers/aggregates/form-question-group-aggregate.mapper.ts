import { FormQuestionGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-group.aggregate';
import { FormQuestionGroupEntityMapper, FormQuestionGroupEntityMapperConstructor } from '../entities/form-question-group.mapper';
import { FormEntityMapper, FormEntityMapperConstructor } from '../entities/form.mapper';
import { FormQuestionAggregateMapper, FormQuestionAggregateMapperConstructor } from './form-question-aggregate.mapper';

export type FormQuestionGroupAggregateMapperConstructor = FormQuestionGroupEntityMapperConstructor & {
  form: FormEntityMapperConstructor;
  questions: FormQuestionAggregateMapperConstructor[];
};

export class FormQuestionGroupAggregateMapper {
  static toAggregate(prisma: FormQuestionGroupAggregateMapperConstructor): FormQuestionGroupAggregate {
    return new FormQuestionGroupAggregate({
      questionGroup: FormQuestionGroupEntityMapper.toEntity(prisma),
      questions: FormQuestionAggregateMapper.toArray(prisma.questions),
      form: FormEntityMapper.toEntity(prisma.form),
    });
  }

  static toArray(prisma: FormQuestionGroupAggregateMapperConstructor[]) {
    return prisma.map((p: FormQuestionGroupAggregateMapperConstructor) => FormQuestionGroupAggregateMapper.toAggregate(p));
  }
}
