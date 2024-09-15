import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { percentageCheck } from "../../functions/security/percentage-check.func";

export type IRiskDataQuantityQuiVO = {
  stel?: string;
  twa?: string;
  nr15lt?: string;
  vmp?: string;

  stelValue?: string;
  twaValue?: string;
  nr15ltValue?: string;
  vmpValue?: string;

  unit?: string;
  manipulation?: string;

  type: QuantityTypeEnum.QUI;
}

export class RiskDataQuantityQuiVO {
  stel?: string;
  twa?: string;
  nr15lt?: string;
  vmp?: string;

  stelValue?: string;
  twaValue?: string;
  nr15ltValue?: string;
  vmpValue?: string;

  unit?: string;
  manipulation?: string;

  type: QuantityTypeEnum.QUI;

  constructor(params: IRiskDataQuantityQuiVO) {
    this.stel = params.stel;
    this.twa = params.twa;
    this.nr15lt = params.nr15lt;
    this.vmp = params.vmp;

    this.stelValue = params.stelValue;
    this.twaValue = params.twaValue;
    this.nr15ltValue = params.nr15ltValue;
    this.vmpValue = params.vmpValue;

    this.unit = params.unit;
    this.manipulation = params.manipulation;
    this.type = params.type;
  }

  get probability() {
    return this.nr15ltProb || this.stelProb || this.twaProb || this.vmpProb;
  }

  get isNr15Teto() {
    return !!(this.nr15lt && this.nr15lt.includes('T'));
  }

  get isStelTeto() {
    return this.stel && this.stel.includes('C');
  }

  get isTwaTeto() {
    return this.twa && this.twa.includes('C');
  }

  get isVmpTeto() {
    return this.vmp && this.vmp.includes('T');
  }

  get nr15ltProb() {
    return percentageCheck({ value: this.nr15ltValue, limit: this.nr15lt, maxLimitMultiplier: this.isNr15Teto ? 1 : 5 });
  }

  get stelProb() {
    return percentageCheck({ value: this.stelValue, limit: this.stel, maxLimitMultiplier: this.isStelTeto ? 1 : 5 });
  }

  get twaProb() {
    return percentageCheck({ value: this.twaValue, limit: this.twa, maxLimitMultiplier: this.isTwaTeto ? 1 : 5 });
  }

  get vmpProb() {
    return percentageCheck({ value: this.vmpValue, limit: this.vmp, maxLimitMultiplier: 1 });
  }

}
