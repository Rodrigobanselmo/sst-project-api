export enum QuantityTypeEnum {
  RADIATION = 'RADIATION',
  QUI = 'QUI',
  NOISE = 'NOISE',
  HEAT = 'HEAT',
  VL = 'VL',
  VFB = 'VFB',
}

export interface IRiskDataJsonQui {
  stel?: string;
  twa?: string;
  nr15lt?: string;
  vmp?: string;
  stelValue?: string;
  twaValue?: string;
  nr15ltValue?: string;
  vmpValue?: string;
  unit?: string;

  isNr15Teto: boolean;
  isStelTeto: boolean;
  isTwaTeto: boolean;
  isVmpTeto: boolean;

  stelProb?: number;
  twaProb?: number;
  vmpProb?: number;
  nr15ltProb?: number;
  type: QuantityTypeEnum.QUI;
}

export interface IRiskDataJsonNoise {
  ltcatq3?: string;
  ltcatq5?: string;
  nr15q5?: string;
  type: QuantityTypeEnum.NOISE;
}

export interface IRiskDataJsonHeat {
  ibtug?: string;
  mw?: string;
  isAcclimatized?: boolean;
  clothesType?: number;
  type: QuantityTypeEnum.HEAT;
}

export interface IRiskDataJsonRadiation {
  //* dont change dose prop names, because I made a bad call
  doseFB?: string;
  doseEye?: string;
  doseSkin?: string;
  doseHand?: string;
  doseFBPublic?: string;
  doseEyePublic?: string;
  doseSkinPublic?: string;

  doseFBProb?: number;
  doseEyeProb?: number;
  doseSkinProb?: number;
  doseHandProb?: number;
  doseFBPublicProb?: number;
  doseEyePublicProb?: number;
  doseSkinPublicProb?: number;
  type: QuantityTypeEnum.RADIATION;
}

export interface IRiskDataJsonVibration {
  aren?: string;
  vdvr?: string;
  type: QuantityTypeEnum.VFB | QuantityTypeEnum.VL;
}

export type IRiskDataJson =
  | IRiskDataJsonNoise
  | IRiskDataJsonQui
  | IRiskDataJsonRadiation
  | IRiskDataJsonHeat
  | IRiskDataJsonVibration;
