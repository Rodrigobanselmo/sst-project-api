import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { percentageCheck } from "../../functions/security/percentage-check.func";

function hasAcgihCeilingMarker(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const normalized = value.trim();

  return (
    /\bC(eiling)?\b/i.test(normalized) ||
    /\bC$/i.test(normalized) ||
    /\(C\)/i.test(normalized)
  );
}

export type IRiskDataQuantityQuiVO = {
  stel?: string;
  twa?: string;
  acgihCeiling?: string;
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
  acgihCeiling?: string;
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
    this.acgihCeiling = params.acgihCeiling;
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
    return (
      Boolean(this.acgihCeiling?.trim()) ||
      (this.stel && hasAcgihCeilingMarker(this.stel))
    );
  }

  get isTwaTeto() {
    return this.twa && hasAcgihCeilingMarker(this.twa);
  }

  get isVmpTeto() {
    return this.vmp && this.vmp.includes('T');
  }

  get stelLimitValue() {
    return this.acgihCeiling?.trim() || this.stel;
  }

  get nr15ltProb() {
    return percentageCheck({ value: this.nr15ltValue, limit: this.nr15lt, maxLimitMultiplier: this.isNr15Teto ? 1 : 5 });
  }

  get stelProb() {
    return percentageCheck({ value: this.stelValue, limit: this.stelLimitValue, maxLimitMultiplier: this.isStelTeto ? 1 : 5 });
  }

  get twaProb() {
    return percentageCheck({ value: this.twaValue, limit: this.twa, maxLimitMultiplier: this.isTwaTeto ? 1 : 5 });
  }

  get vmpProb() {
    return percentageCheck({ value: this.vmpValue, limit: this.vmp, maxLimitMultiplier: 1 });
  }

}
