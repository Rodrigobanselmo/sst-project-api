import { EffectivenessStatusEnum } from '@/@v2/security/action-plan/domain/enums/effectiveness-status.enum';

export namespace IEditActionPlanEffectivenessUseCase {
  export type Params = {
    companyId: string;
    recommendationId: string;
    riskDataId: string;
    workspaceId: string;
    effectivenessStatus: EffectivenessStatusEnum;
    effectivenessComment?: string | null;
  };
}
