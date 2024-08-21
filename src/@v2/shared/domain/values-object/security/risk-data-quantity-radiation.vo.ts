import { QuantityTypeEnum } from "../../enum/security/quantity-type.enum";
import { percentageCheck } from "../../functions/security/percentage-check.func";

export type IRiskDataQuantityRadiationVO = {
  //* dont change dose prop names, because I made a bad call
  doseFB?: string;
  doseEye?: string;
  doseSkin?: string;
  doseHand?: string;
  doseFBPublic?: string;
  doseEyePublic?: string;
  doseSkinPublic?: string;

  type: QuantityTypeEnum.RADIATION;
}

export class RiskDataQuantityRadiationVO {
  doseFB?: string;
  doseEye?: string;
  doseSkin?: string;
  doseHand?: string;
  doseFBPublic?: string;
  doseEyePublic?: string;
  doseSkinPublic?: string;

  type: QuantityTypeEnum.RADIATION;

  constructor(params: IRiskDataQuantityRadiationVO) {
    this.doseFB = params.doseFB;
    this.doseEye = params.doseEye;
    this.doseSkin = params.doseSkin;
    this.doseHand = params.doseHand;
    this.doseFBPublic = params.doseFBPublic;
    this.doseEyePublic = params.doseEyePublic;
    this.doseSkinPublic = params.doseSkinPublic;
    this.type = params.type;
  }

  get probability() {
    return Math.max(
      this.doseFBProb,
      this.doseFBPublicProb,
      this.doseEyeProb,
      this.doseEyePublicProb,
      this.doseSkinProb,
      this.doseSkinPublicProb,
      this.doseHandProb
    );
  }

  get doseFBProb() {
    return percentageCheck({ value: this.doseFB, limit: '20' });
  }

  get doseFBPublicProb() {
    return percentageCheck({ value: this.doseFBPublic, limit: '1' });
  }

  get doseEyeProb() {
    return percentageCheck({ value: this.doseEye, limit: '20' });
  }

  get doseEyePublicProb() {
    return percentageCheck({ value: this.doseEyePublic, limit: '15' });
  }

  get doseSkinProb() {
    return percentageCheck({ value: this.doseSkin, limit: '500' });
  }

  get doseSkinPublicProb() {
    return percentageCheck({ value: this.doseSkinPublic, limit: '50' });
  }

  get doseHandProb() {
    return percentageCheck({ value: this.doseHand, limit: '500' });
  }
}
