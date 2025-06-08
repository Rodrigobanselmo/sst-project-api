import { ActionPlanStatusEnum } from '../domain/enums/action-plan-status.enum';

export const ActionPlanStatusTypeTranslate: Record<ActionPlanStatusEnum, string> = {
  [ActionPlanStatusEnum.PENDING]: 'Pendente',
  [ActionPlanStatusEnum.PROGRESS]: 'Inciado',
  [ActionPlanStatusEnum.DONE]: 'Concluído',
  [ActionPlanStatusEnum.CANCELED]: 'Cancelado',
  [ActionPlanStatusEnum.REJECTED]: 'Rejeitado',
};

export const ActionPlanStatusTypeColorTranslate: Record<ActionPlanStatusEnum, string> = {
  [ActionPlanStatusEnum.PENDING]: '#cf940a',
  [ActionPlanStatusEnum.PROGRESS]: '#4466ff',
  [ActionPlanStatusEnum.DONE]: '#64c6a2',
  [ActionPlanStatusEnum.CANCELED]: '#b13a41',
  [ActionPlanStatusEnum.REJECTED]: '#b13a41',
};
