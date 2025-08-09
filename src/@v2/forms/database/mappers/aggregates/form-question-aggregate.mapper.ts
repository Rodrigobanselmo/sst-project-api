import { FormQuestionAggregate } from '@/@v2/forms/domain/aggregates/form-question.aggregate';
import { FormQuestionDetails, FormQuestionDetailsData } from '@prisma/client';
import { FormQuestionDetailsEntityMapper } from '../entities/form-question-details.mapper';
import { FormQuestionIdentifierEntityMapper, FormQuestionIdentifierEntityMapperConstructor } from '../entities/form-question-identifier.mapper';
import { FormQuestionOptionEntityMapper, FormQuestionOptionEntityMapperConstructor } from '../entities/form-question-option.mapper';
import { FormQuestionEntityMapper, FormQuestionEntityMapperConstructor } from '../entities/form-question.mapper';

export type FormQuestionAggregateMapperConstructor = FormQuestionEntityMapperConstructor & {
  question_details: FormQuestionDetails & {
    options: FormQuestionOptionEntityMapperConstructor[];
    data: (FormQuestionDetailsData & {
      question_identifier: FormQuestionIdentifierEntityMapperConstructor | null;
    })[];
  };
};

export class FormQuestionAggregateMapper {
  static toAggregate(prisma: FormQuestionAggregateMapperConstructor): FormQuestionAggregate {
    const questionEntity = FormQuestionEntityMapper.toEntity(prisma);
    const detailsEntity = FormQuestionDetailsEntityMapper.toEntity(prisma.question_details);
    const optionsEntities = FormQuestionOptionEntityMapper.toArray(prisma.question_details.options);
    const identifierEntity = prisma.question_details.data[0]?.question_identifier ? FormQuestionIdentifierEntityMapper.toEntity(prisma.question_details.data[0]?.question_identifier) : null;

    return new FormQuestionAggregate({
      question: questionEntity,
      details: detailsEntity,
      options: optionsEntities,
      identifier: identifierEntity,
    });
  }

  static toArray(prisma: FormQuestionAggregateMapperConstructor[]) {
    return prisma.map((p: FormQuestionAggregateMapperConstructor) => FormQuestionAggregateMapper.toAggregate(p));
  }
}
