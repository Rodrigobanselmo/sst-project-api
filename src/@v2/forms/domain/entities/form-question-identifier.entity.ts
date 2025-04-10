import { FormIdentifierTypeEnum } from '../enums/form-identifier-type.enum';

export type FormQuestionIdentifierEntityConstructor = {
  id?: number;
  directAssociation?: boolean;
  type: FormIdentifierTypeEnum;
};

export class FormQuestionIdentifierEntity {
  id: number;
  directAssociation: boolean;
  type: FormIdentifierTypeEnum;

  constructor(params: FormQuestionIdentifierEntityConstructor) {
    this.id = params.id ?? 0;
    this.directAssociation = params.directAssociation ?? false;
    this.type = params.type;
  }
}
