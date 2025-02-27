import { borderStyleGlobal } from '../../../base/config/styles';
import { palette } from '../../../constants/palette';
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
}

const NewActionPlanHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[ActionPlanColumnEnum.ITEM] = {
    text: 'ITEM',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.ORIGIN] = {
    text: 'ORIGEM',
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RISK] = {
    text: 'PERIGOS\nFATORES DE RISCO',
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.SOURCE] = {
    text: 'FONTE GERADORA OU\nATIVIDADE DE RISCO',
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.SEVERITY] = {
    text: 'SEVERIDADE',
    size: 1,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.PROBABILITY] = {
    text: 'PROBABILIDADE',
    size: 1,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RO] = {
    text: 'RISCO OCUPACIONAL',
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.INTERVENTION] = {
    text: 'INTERVENÇÃO',
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RECOMMENDATION] = {
    text: 'RECOMENDAÇÕES',
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.RESPONSIBLE] = {
    text: 'RESPONSÁVEL',
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  };
  header[ActionPlanColumnEnum.DUE] = {
    text: 'PRAZO',
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  };

  return header;
};

export const actionPlanHeader = NewActionPlanHeader();

export const actionPlanTitle: string[] = ['PLANO DE AÇÃO', 'PGR - PROGRAMA DE GERENCIAMENTO DE RISCOS'];
