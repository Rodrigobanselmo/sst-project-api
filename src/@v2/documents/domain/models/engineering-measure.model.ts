import { isNotAnMeasure } from '@/@v2/shared/domain/functions/shared/isNotAnMeasure';

export type IEngineeringMeasureModel = {
  name: string;
  efficientlyCheck: boolean;
};

export class EngineeringMeasureModel {
  name: string;
  efficientlyCheck: boolean;

  constructor(params: IEngineeringMeasureModel) {
    this.name = params.name;
    this.efficientlyCheck = params.efficientlyCheck;
  }

  get isNotAnMeasure() {
    return isNotAnMeasure(this.name);
  }
}
