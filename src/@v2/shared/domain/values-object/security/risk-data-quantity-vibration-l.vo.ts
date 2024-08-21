import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { valuesCheck } from "../../functions/security/values-check.func";

export type IRiskDataQuantityVibrationLVO = {
  aren?: string;
  vdvr?: string;
  type: QuantityTypeEnum.VL;
}

export class RiskDataQuantityVibrationLVO {
  private limitArenList = [0, 0.5, 2.5, 3.5, 5.01, 10000000000];

  aren?: string;
  type: QuantityTypeEnum.VL;

  constructor(params: IRiskDataQuantityVibrationLVO) {
    this.aren = params.aren;
    this.type = params.type;
  }

  get probability() {
    return this.arenProb
  }

  get arenProb() {
    return valuesCheck({ value: this.aren, limits: this.limitArenList });
  }
}
