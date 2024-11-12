import { ActionPlanEntity } from "../entities/action-plan.entity";
import { CommentEntity } from "../entities/comment.entity";
import { ActionPlanStatusEnum } from "../enums/action-plan-status.enum";

type IUpdateApprovement = {
  isApproved: boolean;
  approvedById: number;
  approvedComment: string | null;
}

export type ICommentAggregate = {
  comment: CommentEntity
  actionPlan: ActionPlanEntity
}

export class CommentAggregate {
  comment: CommentEntity
  actionPlan: ActionPlanEntity

  constructor(params: ICommentAggregate) {
    this.actionPlan = params.actionPlan;
    this.comment = params.comment;
  }


  approve({ approvedById, isApproved, approvedComment }: IUpdateApprovement) {
    if (!isApproved) {
      this.actionPlan._status = ActionPlanStatusEnum.REJECTED;
      this.actionPlan._doneDate = null;
      this.actionPlan._canceledDate = null;
      this.comment._approvedAt = null;
    } else {
      this.comment._approvedAt = new Date();
    }

    this.comment._isApproved = isApproved;
    this.comment._approvedComment = approvedComment;
    this.comment._approvedById = approvedById;
  }
}