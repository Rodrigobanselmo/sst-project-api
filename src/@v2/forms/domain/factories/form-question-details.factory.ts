import { FormQuestionDetailsEntity } from '../entities/form-question-details.entity';
import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';
import { FormIdentifierTypeEnum } from '../enums/form-identifier-type.enum';

export class FormQuestionDetailsFactory {
  private static mapIdentifierTypeToQuestionType(identifierType: FormIdentifierTypeEnum): FormQuestionTypeEnum {
    switch (identifierType) {
      case FormIdentifierTypeEnum.CUSTOM:
        return FormQuestionTypeEnum.RADIO;
      default:
        return FormQuestionTypeEnum.TEXT;
    }
  }

  static createFromIdentifierType(params: { text: string; identifierType: FormIdentifierTypeEnum; companyId: string; acceptOther?: boolean }): FormQuestionDetailsEntity {
    const questionType = this.mapIdentifierTypeToQuestionType(params.identifierType);

    return new FormQuestionDetailsEntity({
      text: params.text,
      type: questionType,
      companyId: params.companyId,
      acceptOther: params.acceptOther,
    });
  }

  static createFromQuestionType(params: { text: string; type: FormQuestionTypeEnum; companyId: string; acceptOther?: boolean }): FormQuestionDetailsEntity {
    return new FormQuestionDetailsEntity({
      text: params.text,
      type: params.type,
      companyId: params.companyId,
      acceptOther: params.acceptOther,
    });
  }
}
