import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormAnswerEntityConstructor = {
  id?: string;
  questionId: string;
  createdAt?: Date;
  updatedAt?: Date;
  optionIds?: string[];
  value?: string;
};

export class FormAnswerEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  optionIds: string[];
  questionId: string;
  value?: string;

  constructor(params: FormAnswerEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.optionIds = params.optionIds || [];
    this.questionId = params.questionId;
    this.value = params.value;

    if (this.optionIds.length === 0 && !this.value) {
      throw new Error('Nenhum valor foi informado para a resposta');
    }
  }
}
