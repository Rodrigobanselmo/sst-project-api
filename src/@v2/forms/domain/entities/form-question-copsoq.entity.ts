import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';
import { FormCOPSOQCategoryEnum } from '../enums/form-copsoq-category.enum';
import { FormCOPSOQDimensionEnum } from '../enums/form-copsoq-dimension.enum';
import { FormCOPSOQLevelEnum } from '../enums/form-copsoq-level.enum';

export type FormQuestionCOPSOQEntityConstructor = {
  id?: string;
  dimension: FormCOPSOQDimensionEnum;
  category: FormCOPSOQCategoryEnum;
  item: string;
  question: string;
  level: FormCOPSOQLevelEnum;
};

export class FormQuestionCOPSOQEntity {
  id: string;
  dimension: FormCOPSOQDimensionEnum;
  category: FormCOPSOQCategoryEnum;
  item: string;
  question: string;
  level: FormCOPSOQLevelEnum;

  constructor(params: FormQuestionCOPSOQEntityConstructor) {
    this.id = params.id ?? generateCuid();
    this.dimension = params.dimension;
    this.category = params.category;
    this.item = params.item;
    this.question = params.question;
    this.level = params.level;
  }
}
