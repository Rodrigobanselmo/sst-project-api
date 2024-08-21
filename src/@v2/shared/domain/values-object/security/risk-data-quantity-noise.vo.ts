import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { valuesCheck } from "../../functions/security/values-check.func";

export type IRiskDataQuantityNoiseVO = {
  ltcatq3?: string;
  ltcatq5?: string;
  nr15q5?: string;
  type: QuantityTypeEnum.NOISE;
}

export class RiskDataQuantityNoiseVO {
  private limitQ3List = [75, 79, 82, 85, 115, 10000000];
  private limitQ5List = [64.4, 75, 80, 85, 115, 10000000];

  ltcatq3?: string;
  ltcatq5?: string;
  nr15q5?: string;
  type: QuantityTypeEnum.NOISE;

  constructor(params: IRiskDataQuantityNoiseVO) {
    this.ltcatq3 = params.ltcatq3;
    this.ltcatq5 = params.ltcatq5;
    this.nr15q5 = params.nr15q5;
    this.type = params.type;
  }

  get probability() {
    return Math.max(this.ltcatq3Prob, this.ltcatq5Prob, this.nr15q5Prob)
  }

  get ltcatq3Prob() {
    return valuesCheck({ value: this.ltcatq3, limits: this.limitQ3List });
  }

  get ltcatq5Prob() {
    return valuesCheck({ value: this.ltcatq5, limits: this.limitQ5List });
  }

  get nr15q5Prob() {
    return valuesCheck({ value: this.nr15q5, limits: this.limitQ5List });
  }

}
