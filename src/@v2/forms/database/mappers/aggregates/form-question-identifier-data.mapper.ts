import { FormQuestionIdentifierDataAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-data.aggregate';
import { FormQuestionDataEntityMapper, FormQuestionDataEntityMapperConstructor } from '../entities/form-question-data.mapper';
import { FormQuestionIdentifierEntityMapper, FormQuestionIdentifierEntityMapperConstructor } from '../entities/form-question-identifier.mapper';

export type FormQuestionIdentifierDataAggregateMapperConstructor = FormQuestionDataEntityMapperConstructor & {
  question_identifier: FormQuestionIdentifierEntityMapperConstructor | null;
};

export class FormQuestionIdentifierDataAggregateMapper {
  static toAggregate(prisma: FormQuestionIdentifierDataAggregateMapperConstructor): FormQuestionIdentifierDataAggregate {
    if (!prisma.question_identifier) throw new Error('Missing question_identifier error');

    return new FormQuestionIdentifierDataAggregate({
      data: FormQuestionDataEntityMapper.toEntity(prisma),
      identifier: FormQuestionIdentifierEntityMapper.toEntity(prisma.question_identifier),
    });
  }

  static toArray(prisma: FormQuestionIdentifierDataAggregateMapperConstructor[]) {
    return prisma.map((p: FormQuestionIdentifierDataAggregateMapperConstructor) => FormQuestionIdentifierDataAggregateMapper.toAggregate(p));
  }
}
