import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';
import { FormIdentifierTypeEnum } from '../enums/form-identifier-type.enum';

export type FormQuestionIdentifierEntityConstructor = {
  id?: string;
  directAssociation?: boolean;
  type: FormIdentifierTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormQuestionIdentifierEntity {
  id: string;
  directAssociation: boolean;
  type: FormIdentifierTypeEnum;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormQuestionIdentifierEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.directAssociation = params.directAssociation ?? false;
    this.type = params.type;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
