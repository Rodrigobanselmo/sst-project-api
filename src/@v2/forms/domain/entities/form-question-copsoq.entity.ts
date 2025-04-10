import { FormCOPSOQLevelEnum } from '../enums/form-copsoq-level.enum';
import { FormQuestionTypeEnum } from '../enums/form-question-type.enum';

export type FormQuestionCOPSOQEntityConstructor = {
  id?: number;
  dimension: string;
  category: string;
  item: string;
  question: string;
  level: FormCOPSOQLevelEnum;
  type: FormQuestionTypeEnum;
};

export class FormQuestionCOPSOQEntity {
  id: number;
  dimension: string;
  category: string;
  item: string;
  question: string;
  level: FormCOPSOQLevelEnum;
  type: FormQuestionTypeEnum;

  constructor(params: FormQuestionCOPSOQEntityConstructor) {
    this.id = params.id ?? 0;
    this.dimension = params.dimension;
    this.category = params.category;
    this.item = params.item;
    this.question = params.question;
    this.level = params.level;
    this.type = params.type;
  }
}
