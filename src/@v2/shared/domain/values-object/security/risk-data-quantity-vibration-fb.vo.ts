import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { valuesCheck } from "../../functions/security/values-check.func";

export type IRiskDataQuantityVibrationFBVO = {
  aren?: string;
  vdvr?: string;
  type: QuantityTypeEnum.VFB;
}

export class RiskDataQuantityVibrationFBVO {
  private limitArenList = [0, 0.1, 0.5, 0.9, 1.101, 10000000000];
  private limitVdvrList = [0, 2.1, 9.1, 16.4, 21.01, 10000000000];

  aren?: string;
  vdvr?: string;
  type: QuantityTypeEnum.VFB;

  constructor(params: IRiskDataQuantityVibrationFBVO) {
    this.aren = params.aren;
    this.vdvr = params.vdvr;
    this.type = params.type;
  }

  get probability() {
    return Math.max(this.arenProb, this.vdvrProb)
  }

  get arenProb() {
    return valuesCheck({ value: this.aren, limits: this.limitArenList });
  }

  get vdvrProb() {
    return valuesCheck({ value: this.vdvr, limits: this.limitVdvrList });
  }
}
