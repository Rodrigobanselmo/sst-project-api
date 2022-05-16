/* eslint-disable prettier/prettier */
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { borderRightStyle } from '../../elements/header';

export enum SecondRiskInventoryColumnEnum {
  OFFICIAL,
  REAL,
}

const SecondRiskInventoryHeader = (): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[SecondRiskInventoryColumnEnum.OFFICIAL] = { text: 'DESCRIÇÃO DE CARGO OFIIAL (RH):', bold: true, borders: borderRightStyle  };
  header[SecondRiskInventoryColumnEnum.REAL] = { text: 'DESCRIÇÃO DA FUNÇÃO E ATIVIDADES DE RISCO (Entrevista com o Trabalhador):' , bold: true, borders: borderNoneStyle};

  return header;
};

export const secondRiskInventoryHeader = SecondRiskInventoryHeader();
