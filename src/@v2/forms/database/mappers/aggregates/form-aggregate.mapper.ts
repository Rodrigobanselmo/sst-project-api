import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { FormQuestionDetailsEntity } from '@/@v2/forms/domain/entities/form-question-details.entity';
import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormQuestionDetails, FormQuestionDetailsData, FormQuestionOption, FormQuestionOptionData } from '@prisma/client';
import { FormQuestionDataEntityMapperConstructor } from '../entities/form-question-data.mapper';
import { FormQuestionGroupEntityMapper, FormQuestionGroupEntityMapperConstructor } from '../entities/form-question-group.mapper';
import { FormQuestionEntityMapper, FormQuestionEntityMapperConstructor } from '../entities/form-question.mapper';
import { FormEntityMapper, FormEntityMapperConstructor } from '../entities/form.mapper';

export type FormAggregateMapperConstructor = FormEntityMapperConstructor & {
  questions_groups: (FormQuestionGroupEntityMapperConstructor & {
    questions: (FormQuestionEntityMapperConstructor & {
      data: FormQuestionDataEntityMapperConstructor[];
      question_details: FormQuestionDetails & {
        data: FormQuestionDetailsData[];
        options: (FormQuestionOption & {
          data: FormQuestionOptionData[];
        })[];
      };
    })[];
  })[];
};

export class FormAggregateMapper {
  static toAggregate(prisma: FormAggregateMapperConstructor): FormAggregate {
    return new FormAggregate({
      form: FormEntityMapper.toEntity(prisma),
      questionGroups: prisma.questions_groups.map((group) => {
        const questionGroupEntity = FormQuestionGroupEntityMapper.toEntity(group);
        const questions = group.questions.map((question) => {
          const questionEntity = FormQuestionEntityMapper.toEntity(question);
          const questionDetails = question.question_details.data[0]!; // Get the first details data entry

          // Create FormQuestionDetailsEntity
          const detailsEntity = new FormQuestionDetailsEntity({
            id: question.question_details.id,
            text: questionDetails.text,
            type: FormQuestionTypeEnum[questionDetails.type],
            acceptOther: questionDetails.accept_other,
            system: question.question_details.system,
            companyId: question.question_details.company_id,
            createdAt: question.question_details.created_at,
            deletedAt: question.question_details.deleted_at,
          });

          // Create FormQuestionOptionEntity array
          const optionsEntities = question.question_details.options.map((option) => {
            const optionData = option.data[0];
            return new FormQuestionOptionEntity({
              id: option.id,
              text: optionData?.text || '',
              order: optionData?.order || 0,
              value: optionData?.value || 0,
              createdAt: option.created_at,
              deletedAt: option.deleted_at,
            });
          });

          return Object.assign(questionEntity, {
            details: detailsEntity,
            options: optionsEntities,
          });
        });

        return Object.assign(questionGroupEntity, {
          questions,
        });
      }),
    });
  }

  static toArray(prisma: FormAggregateMapperConstructor[]) {
    return prisma.map((p: FormAggregateMapperConstructor) => FormAggregateMapper.toAggregate(p));
  }
}
