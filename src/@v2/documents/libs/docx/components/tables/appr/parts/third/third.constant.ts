/* eslint-disable prettier/prettier */
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { borderRightStyle, whiteColumnBorder } from '../../elements/header';
import {
  thirdRiskInventoryColumnWidth,
  thirdRiskInventoryVerticalColumns,
} from '@/modules/documents/docx/components/tables/appr/parts/third/third.constant';

export enum ThirdRiskInventoryHeaderEnum {
  FIRST,
  SECOND,
  THIRD,
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
  RISK_OCCUPATIONAL_AFTER,
}

export const ThirdRiskInventoryHeader = (isHideOrigin: boolean): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[ThirdRiskInventoryHeaderEnum.FIRST] = {
    text: 'Severidade (S) x Probabilidade (P) = RISCO OCUPACIONAL (RO):',
    bold: true,
    borders: borderNoneStyle,
    columnSpan: isHideOrigin ? 4 : 5,
  };
  header[ThirdRiskInventoryHeaderEnum.SECOND] = {
    text: 'RISCO PURO (REAL) Incluindo as Medidas de Controles Existentes',
    bold: true,
    borders: borderRightStyle,
    columnSpan: 6,
  };
  header[ThirdRiskInventoryHeaderEnum.THIRD] = {
    text: 'RISCO RESIDUAL',
    bold: true,
    borders: borderNoneStyle,
    columnSpan: 4,
  };

  return header;
};

export const ThirdRiskInventoryColumnsHeader = (isHideOrigin: boolean): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[ThirdRiskInventoryColumnEnum.TYPE] = {
    text: 'Tipo',
    bold: true,
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.TYPE],
    isVertical: thirdRiskInventoryVerticalColumns.has(ThirdRiskInventoryColumnEnum.TYPE),
    margins: { top: 100, bottom: 100 },
  };
  if (!isHideOrigin)
    header[ThirdRiskInventoryColumnEnum.ORIGIN] = {
      text: 'Origem',
      bold: true,
      borders: { ...borderNoneStyle, right: whiteColumnBorder },
      size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.ORIGIN],
      margins: { top: 100, bottom: 100 },
    };
  header[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = {
    text: 'PERIGOS | FATORES DE RISCO',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.RISK_FACTOR],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.RISK] = {
    text: 'Risco',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.RISK],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.SOURCE] = {
    text: 'Fonte Geradora ou Circunstância de Risco',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.SOURCE],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.EPI] = {
    text: 'EPI Específico',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.EPI],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.ENG] = {
    text: 'EPC/ENG.',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.ENG],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.ADM] = {
    text: 'ADM',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.ADM],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.SEVERITY] = {
    text: 'S',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.SEVERITY],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.PROBABILITY] = {
    text: 'P',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.PROBABILITY],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL] = {
    text: 'RO',
    borders: borderRightStyle,
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL],
    isVertical: thirdRiskInventoryVerticalColumns.has(
      ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL,
    ),
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = {
    text: 'Recomendações',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = {
    text: 'S',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = {
    text: 'P',
    borders: { ...borderNoneStyle, right: whiteColumnBorder },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER],
    margins: { top: 100, bottom: 100 },
  };
  header[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = {
    text: 'RO',
    borders: { ...borderNoneStyle },
    size: thirdRiskInventoryColumnWidth[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER],
    isVertical: thirdRiskInventoryVerticalColumns.has(
      ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER,
    ),
    margins: { top: 100, bottom: 100 },
  };

  return header.filter(Boolean);
};
