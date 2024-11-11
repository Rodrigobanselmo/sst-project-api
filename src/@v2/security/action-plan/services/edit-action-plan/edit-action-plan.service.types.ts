import { ActionPlanStatusEnum } from "@/@v2/security/action-plan/domain/enums/action-plan-status.enum";
import { CommentTextTypeEnum } from "@/@v2/security/action-plan/domain/enums/comment-text-type.enum";

export namespace IEditActionPlanService {
  export type Params = {
    companyId: string
    userId: number
    recommendationId: string;
    riskDataId: string;
    workspaceId: string;
    responsibleId?: number | null;
    validDate?: Date | null;
    status?: ActionPlanStatusEnum;
    comment?: {
      text?: string
      textType?: CommentTextTypeEnum
    }
  }
}
