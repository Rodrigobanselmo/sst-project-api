import { EffectivenessStatusEnum } from '@/@v2/security/action-plan/domain/enums/effectiveness-status.enum';

export namespace IEditActionPlanEffectivenessService {
  export type Params = {
    companyId: string;
    userId: number;
    recommendationId: string;
    riskDataId: string;
    workspaceId: string;
    effectivenessStatus: EffectivenessStatusEnum;
    effectivenessComment?: string | null;
  };
}
