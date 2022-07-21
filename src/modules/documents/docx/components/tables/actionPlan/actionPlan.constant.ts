/* eslint-disable prettier/prettier */
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

  header[ActionPlanColumnEnum.ITEM] = { text: 'ITEM', size: 2 }
  header[ActionPlanColumnEnum.ORIGIN] = { text: 'ORIGEM', size: 5 }
  header[ActionPlanColumnEnum.RISK] = { text: 'PERIGOS\nFATORES DE RISCO', size: 10 }
  header[ActionPlanColumnEnum.SOURCE] = { text: 'FONTE GERADORA OU\nATIVIDADE DE RISCO', size: 10 }
  header[ActionPlanColumnEnum.SEVERITY] = { text: 'SEVERIDADE', size: 1 }
  header[ActionPlanColumnEnum.PROBABILITY] = { text: 'PROBABILIDADE', size: 1 }
  header[ActionPlanColumnEnum.RO] = { text: 'RISCO OCUPACIONAL', size: 5 }
  header[ActionPlanColumnEnum.INTERVENTION] = { text: 'INTERVENÇÃO', size: 5 }
  header[ActionPlanColumnEnum.RECOMMENDATION] = { text: 'RECOMENDAÇÕES', size: 10 }
  header[ActionPlanColumnEnum.RESPONSIBLE] = { text: 'RESPONSÁVEL', size: 5 }
  header[ActionPlanColumnEnum.DUE] = { text: 'PRAZO', size: 5 }

  return header
};

export const actionPlanHeader = NewActionPlanHeader()


export const actionPlanTitle: string[] = [
  'PLANO DE AÇÃO',
  'PGR - PROGRAMA DE GERENCIAMENTO DE RISCOS',
];

