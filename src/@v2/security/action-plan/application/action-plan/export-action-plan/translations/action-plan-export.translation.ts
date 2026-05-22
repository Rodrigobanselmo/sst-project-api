import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { OriginTypeEnum } from '@/@v2/shared/domain/enum/security/origin-type.enum';
import { IRiskLevelValues } from '@/@v2/shared/domain/types/security/risk-level-values.type';

export const ActionPlanStatusExportTranslation: Record<ActionPlanStatusEnum, string> = {
  [ActionPlanStatusEnum.PENDING]: 'Pendente',
  [ActionPlanStatusEnum.PROGRESS]: 'Iniciado',
  [ActionPlanStatusEnum.DONE]: 'Concluído',
  [ActionPlanStatusEnum.CANCELED]: 'Cancelado',
  [ActionPlanStatusEnum.REJECTED]: 'Rejeitado',
};

export const OccupationalRiskLevelExportTranslation: Record<IRiskLevelValues, string> = {
  [1]: 'Muito Baixo',
  [2]: 'Baixo',
  [3]: 'Médio',
  [4]: 'Alto',
  [5]: 'Muito Alto',
  [6]: 'Interromper',
};

export const OriginTypeExportTranslation: Record<OriginTypeEnum, string> = {
  [OriginTypeEnum.HOMOGENEOUS_GROUP]: 'Grupo similar de exposição',
  [OriginTypeEnum.DIRECTORY]: 'Superintendência',
  [OriginTypeEnum.MANAGEMENT]: 'Diretoria',
  [OriginTypeEnum.SECTOR]: 'Setor',
  [OriginTypeEnum.SUB_SECTOR]: 'Sub setor',
  [OriginTypeEnum.OFFICE]: 'Cargo',
  [OriginTypeEnum.SUB_OFFICE]: 'Cargo desenvolvido',
  [OriginTypeEnum.WORKSTATION]: 'Posto de trabalho',
  [OriginTypeEnum.EQUIPMENT]: 'Equipamento',
  [OriginTypeEnum.ACTIVITIES]: 'Atividades',
  [OriginTypeEnum.GENERAL]: 'Ambiente geral',
  [OriginTypeEnum.SUPPORT]: 'Ambiente suporte',
  [OriginTypeEnum.OPERATION]: 'Ambiente operacional',
  [OriginTypeEnum.ADMINISTRATIVE]: 'Ambiente administrativo',
};
