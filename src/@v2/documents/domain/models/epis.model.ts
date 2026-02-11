import { isNotAnEpi } from '@/@v2/shared/domain/functions/shared/isNotAnEpi';

export type IEPIModel = {
  ca: string;
  equipment: string;
  efficientlyCheck: boolean;
};

export class EPIModel {
  ca: string;
  equipment: string;
  efficientlyCheck: boolean;

  constructor(params: IEPIModel) {
    this.ca = params.ca;
    this.equipment = params.equipment;
    this.efficientlyCheck = params.efficientlyCheck;
  }

  get name() {
    return `${this.equipment} CA: ${this.ca}`;
  }

  get isNotAnEpi() {
    return isNotAnEpi(this.ca);
  }
}
