import { palette } from '../../../../../../shared/constants/palette';
import { borderStyleGlobal } from '../../../base/config/styles';
import { headerTableProps } from './elements/header';

export enum ActionPlanColumnEnum {
  ITEM,
  ORIGIN,
  RISK,
  SOURCE,
  SEVERITY,
  PROBABILITY,
  RO,
  INTERVENTION,
  RECOMMENDATION,
  RESPONSIBLE,
  DUE,
  STATUS,
}

const NewActionPlanHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[ActionPlanColumnEnum.ITEM] = {
    text: 'ITEM',
    size: 2,
    isVertical: false,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.ORIGIN] = {
    text: 'ORIGEM',
    size: 15,
    isVertical: false,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RISK] = {
    text: 'PERIGOS /\nFATORES DE RISCO',
    size: 12,
    isVertical: false,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.SOURCE] = {
    text: 'FONTE GERADORA OU\nATIVIDADE DE RISCO',
    size: 35,
    isVertical: false,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.SEVERITY] = {
    text: 'SEVERIDADE',
    size: 2,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.PROBABILITY] = {
    text: 'PROBABILIDADE',
    size: 2,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RO] = {
    text: 'RISCO OCUPACIONAL',
    size: 5,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.INTERVENTION] = {
    text: 'INTERVENÇÃO',
    size: 4,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RECOMMENDATION] = {
    text: 'RECOMENDAÇÕES',
    size: 16,
    isVertical: false,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RESPONSIBLE] = {
    text: 'RESPONSÁVEL',
    size: 3,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.DUE] = {
    text: 'PRAZO',
    size: 2,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.STATUS] = {
    text: 'STATUS',
    size: 2,
    isVertical: true,
    borders: borderStyleGlobal(palette.common.white.string),
  };

  return header;
};

export const actionPlanHeader = NewActionPlanHeader();

/** Título acima da tabela do Plano de Ação (fora da grade tabular). */
export const actionPlanSectionTitle = 'PLANO DE AÇÃO — Programa de Gerenciamento de Riscos (PGR)';
