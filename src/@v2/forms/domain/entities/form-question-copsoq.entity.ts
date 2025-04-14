import { FormCOPSOQCategoryEnum } from '../enums/form-copsoq-category.enum';
import { FormCOPSOQDimensionEnum } from '../enums/form-copsoq-dimension.enum';
import { FormCOPSOQLevelEnum } from '../enums/form-copsoq-level.enum';

export type FormQuestionCOPSOQEntityConstructor = {
  id?: number;
  dimension: FormCOPSOQDimensionEnum;
  category: FormCOPSOQCategoryEnum;
  item: string;
  question: string;
  level: FormCOPSOQLevelEnum;
};

export class FormQuestionCOPSOQEntity {
  id: number;
  dimension: FormCOPSOQDimensionEnum;
  category: FormCOPSOQCategoryEnum;
  item: string;
  question: string;
  level: FormCOPSOQLevelEnum;

  constructor(params: FormQuestionCOPSOQEntityConstructor) {
    this.id = params.id ?? 0;
    this.dimension = params.dimension;
    this.category = params.category;
    this.item = params.item;
    this.question = params.question;
    this.level = params.level;
  }
}
