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
  stelValue?: string;
  twaValue?: string;
  nr15ltValue?: string;
  type: QuantityTypeEnum.QUI;
}

export interface IRiskDataJsonNoise {
  ltcatq3?: string;
  ltcatq5?: string;
  nr15q3?: string;
  type: QuantityTypeEnum.NOISE;
}

export type IRiskDataJson = IRiskDataJsonNoise | IRiskDataJsonQui;
