/* eslint-disable prettier/prettier */
import { bodyTableProps, borderNoneStyle } from '../../elements/body';

export enum SecondRiskInventoryColumnEnum {
  OFFICIAL,
}

export const epiRiskInventoryHeader = (): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[SecondRiskInventoryColumnEnum.OFFICIAL] = {
    text: "EPI's DO GSE:",
    bold: true,
    borders: borderNoneStyle,
  };

  return header;
};
