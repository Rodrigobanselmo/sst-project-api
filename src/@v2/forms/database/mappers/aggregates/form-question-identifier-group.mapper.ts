import { FormQuestionIdentifierGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-group.aggregate';
import { FormQuestionIdentifierGroupEntityMapper, FormQuestionIdentifierGroupEntityMapperConstructor } from '../entities/form-question-identifier-group.mapper';
import { FormQuestionIdentifierAggregateMapper, FormQuestionIdentifierAggregateMapperConstructor } from './form-question-identifier.mapper';

export type FormQuestionIdentifierGroupAggregateMapperConstructor = FormQuestionIdentifierGroupEntityMapperConstructor & {
  questions: FormQuestionIdentifierAggregateMapperConstructor[];
};

export class FormQuestionIdentifierGroupAggregateMapper {
  static toAggregate(prisma: FormQuestionIdentifierGroupAggregateMapperConstructor): FormQuestionIdentifierGroupAggregate {
    return new FormQuestionIdentifierGroupAggregate({
      group: FormQuestionIdentifierGroupEntityMapper.toEntity(prisma),
      questionIdentifiers: FormQuestionIdentifierAggregateMapper.toArray(prisma.questions),
    });
  }

  static toArray(prisma: FormQuestionIdentifierGroupAggregateMapperConstructor[]) {
    return prisma.map((p: FormQuestionIdentifierGroupAggregateMapperConstructor) => FormQuestionIdentifierGroupAggregateMapper.toAggregate(p));
  }
}
