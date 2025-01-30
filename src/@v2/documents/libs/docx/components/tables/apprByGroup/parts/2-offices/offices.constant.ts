import { bodyTableProps, borderNoneStyle } from '../../elements/body';

export enum SecondRiskInventoryColumnEnum {
  OFFICIAL,
  REAL,
}

export const secondRiskInventoryHeader = (): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[SecondRiskInventoryColumnEnum.OFFICIAL] = {
    text: 'ABRANGÊNCIA',
    bold: true,
    borders: borderNoneStyle,
  };

  return header;
};
