/* eslint-disable prettier/prettier */
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { borderRightStyle, whiteColumnBorder } from '../../elements/header';

export enum ThirdRiskInventoryHeaderEnum {
  FIRST,
  SECOND,
  THIRD
}

export enum ThirdRiskInventoryColumnEnum {
  TYPE,
  ORIGIN,
  RISK_FACTOR,
  RISK,
  SOURCE,
  EPI,
  ENG,
  ADM,
  SEVERITY,
  PROBABILITY,
  RISK_OCCUPATIONAL,
  RECOMMENDATIONS,
  SEVERITY_AFTER,
  PROBABILITY_AFTER,
  RISK_OCCUPATIONAL_AFTER
}

const ThirdRiskInventoryHeader = (): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[ThirdRiskInventoryHeaderEnum.FIRST] = { text: 'Severidade (S) x Probabilidade (P) = RISCO OCUPACIONAL (RO):' , bold: true, borders: borderNoneStyle, columnSpan: 5};
  header[ThirdRiskInventoryHeaderEnum.SECOND] = { text: 'RISCO PURO (REAL) Incluindo as Medidas de Controles Existentes', bold: true, borders: borderRightStyle, columnSpan: 6};
  header[ThirdRiskInventoryHeaderEnum.THIRD] = { text: 'RISCO RESIDUAL' , bold: true, borders: borderNoneStyle, columnSpan: 4};

  return header;
};

export const thirdRiskInventoryHeader = ThirdRiskInventoryHeader();

const ThirdRiskInventoryColumnsHeader = (): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[ThirdRiskInventoryColumnEnum.TYPE] = { text: 'Tipo' , bold: true, borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 4,  margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.ORIGIN] = { text: 'Origem' , bold: true, borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 6,  margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = { text: 'PERIGOS | FATORES DE RISCO', borders: {...borderNoneStyle, right:whiteColumnBorder}  , size: 10, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.RISK] = { text: 'Risco' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 7, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.SOURCE] = { text: 'Fonte Geradora ou Condição de Risco' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 10, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.EPI] = { text: 'EPI Específico' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 7, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.ENG] = { text: 'EPC/ENG.' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 7, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.ADM] = { text: 'ADM' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 7, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.SEVERITY] = { text: 'S' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 1, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.PROBABILITY] = { text: 'P' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 1, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL] = { text: 'RO' , borders: borderRightStyle, size: 3, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = { text: 'Recomendações' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 5, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = { text: 'S' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 1, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = { text: 'P' , borders: {...borderNoneStyle, right:whiteColumnBorder}, size: 1, margins: { top: 100, bottom: 100 }};
  header[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = { text: 'RO' , borders: {...borderNoneStyle}, size: 3, margins: { top: 100, bottom: 100 }};

  return header;
};

export const thirdRiskInventoryColumnsHeader = ThirdRiskInventoryColumnsHeader();

