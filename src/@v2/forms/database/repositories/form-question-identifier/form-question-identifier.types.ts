import { FormQuestionIdentifierEntity } from '@/@v2/forms/domain/entities/form-question-identifier.entity';
import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';

// RELOAD
export namespace IFormQuestionIdentifierEntityRepository {
  export type FindParams = { type: FormIdentifierTypeEnum };
  export type FindReturn = Promise<FormQuestionIdentifierEntity | null>;
}
