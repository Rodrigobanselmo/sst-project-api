import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormAnswerEntityConstructor = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  value?: string;
};

export class FormAnswerEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  value?: string;

  constructor(params: FormAnswerEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.value = params.value;
  }
}
