import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';

export type FormAnswerEntityConstructor = {
  id?: string;
  questionId: string;
  createdAt?: Date;
  updatedAt?: Date;
  optionId?: string | null;
  value?: string;
};

export class FormAnswerEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  optionId: string | null;
  questionId: string;
  value?: string;

  constructor(params: FormAnswerEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.optionId = params.optionId || null;
    this.questionId = params.questionId;
    this.value = params.value;

    if (!this.optionId && !this.value) {
      throw new Error('Nenhum valor foi informado para a resposta');
    }
  }
}
