import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormQuestionIdentifierGroupEntityConstructor = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FormQuestionIdentifierGroupEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: FormQuestionIdentifierGroupEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.name = params.name;
    this.description = params.description;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
