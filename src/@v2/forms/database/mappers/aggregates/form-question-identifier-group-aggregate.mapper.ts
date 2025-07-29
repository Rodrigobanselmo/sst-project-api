import { FormQuestionIdentifierGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-group.aggregate';
import { FormApplicationEntityMapper, FormApplicationEntityMapperConstructor } from '../entities/form-application.mapper';
import { FormQuestionGroupEntityMapper, FormQuestionGroupEntityMapperConstructor } from '../entities/form-question-group.mapper';
import { FormQuestionAggregateMapper, FormQuestionAggregateMapperConstructor } from './form-question-aggregate.mapper';

export type FormQuestionIdentifierGroupAggregateMapperConstructor = FormQuestionGroupEntityMapperConstructor & {
  form_application: FormApplicationEntityMapperConstructor;
  questions: FormQuestionAggregateMapperConstructor[];
};

export class FormQuestionIdentifierGroupAggregateMapper {
  static toAggregate(prisma: FormQuestionIdentifierGroupAggregateMapperConstructor): FormQuestionIdentifierGroupAggregate {
    return new FormQuestionIdentifierGroupAggregate({
      questionGroup: FormQuestionGroupEntityMapper.toEntity(prisma),
      formApplication: FormApplicationEntityMapper.toEntity(prisma.form_application),
      questions: FormQuestionAggregateMapper.toArray(prisma.questions),
    });
  }

  static toArray(prisma: FormQuestionIdentifierGroupAggregateMapperConstructor[]) {
    return prisma.map((p: FormQuestionIdentifierGroupAggregateMapperConstructor) => FormQuestionIdentifierGroupAggregateMapper.toAggregate(p));
  }
}
