import { FormQuestionIdentifierAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier.aggregate';
import { FormQuestionEntityMapper, FormQuestionEntityMapperConstructor } from '../entities/form-question.mapper';
import { FormQuestionIdentifierDataAggregateMapper, FormQuestionIdentifierDataAggregateMapperConstructor } from './form-question-identifier-data.mapper';

export type FormQuestionIdentifierAggregateMapperConstructor = FormQuestionEntityMapperConstructor & {
  question_details: FormQuestionIdentifierDataAggregateMapperConstructor;
};

export class FormQuestionIdentifierAggregateMapper {
  static toAggregate(prisma: FormQuestionIdentifierAggregateMapperConstructor): FormQuestionIdentifierAggregate {
    return new FormQuestionIdentifierAggregate({
      question: FormQuestionEntityMapper.toEntity(prisma),
      identifierData: FormQuestionIdentifierDataAggregateMapper.toAggregate(prisma.question_details),
    });
  }

  static toArray(prisma: FormQuestionIdentifierAggregateMapperConstructor[]) {
    return prisma.map((p: FormQuestionIdentifierAggregateMapperConstructor) => FormQuestionIdentifierAggregateMapper.toAggregate(p));
  }
}
