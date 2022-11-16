/* eslint-disable prettier/prettier */
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { borderRightStyle } from '../../elements/header';

export enum SecondRiskInventoryColumnEnum {
  OFFICIAL,
  REAL,
}

export const secondRiskInventoryHeader = (
  isByGroup: boolean,
): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  if (isByGroup)
    header[SecondRiskInventoryColumnEnum.OFFICIAL] = {
      text: 'DESCRIÇÃO DO GSE:',
      bold: true,
      borders: borderNoneStyle,
    };
  else {
    header[SecondRiskInventoryColumnEnum.OFFICIAL] = {
      text: 'DESCRIÇÃO DE CARGO OFICIAL (RH):',
      bold: true,
      borders: borderRightStyle,
    };
    header[SecondRiskInventoryColumnEnum.REAL] = {
      text: 'DESCRIÇÃO DA FUNÇÃO E ATIVIDADES DE RISCO (Entrevista com o Trabalhador):',
      bold: true,
      borders: borderNoneStyle,
    };
  }

  return header;
};
