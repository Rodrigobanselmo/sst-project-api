import { ActionPlanEntity } from "../entities/action-plan.entity";
import { CommentEntity } from "../entities/comment.entity";
import { ActionPlanStatusEnum } from "../enums/action-plan-status.enum";
import { CommentTypeEnum } from "../enums/comment-type.enum";

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
    if (this.comment._isApproved === isApproved) return;

    const isPosponed = this.comment.type === CommentTypeEnum.POSTPONED;
    if (!isApproved) {
      this.comment._approvedAt = null;
      this.actionPlan._status = ActionPlanStatusEnum.REJECTED;
      this.comment._previousStatus = this.actionPlan._status;

      if (isPosponed) {
        const requestedValidDate = this.actionPlan._validDate;

        this.actionPlan._validDate = this.comment._previousValidDate;
        this.comment._previousValidDate = requestedValidDate;
      }
    } else {
      const previousRejected = this.comment.isApproved === false
      if (previousRejected) {
        this.actionPlan._status = this.comment._previousStatus;
        if (isPosponed) {
          const oldValidDate = this.actionPlan._validDate;

          this.actionPlan._validDate = this.comment._previousValidDate;
          this.comment._previousValidDate = oldValidDate
        }
      }

      this.comment._approvedAt = new Date();
    }

    this.comment._isApproved = isApproved;
    this.comment._approvedComment = approvedComment;
    this.comment._approvedById = approvedById;
  }
}