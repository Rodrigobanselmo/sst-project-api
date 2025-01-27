import { ActionPlanEntity } from '../entities/action-plan.entity';
import { CommentEntity } from '../entities/comment.entity';
import { CoordinatorEntity } from '../entities/coordinator.entity';
import { ActionPlanStatusEnum } from '../enums/action-plan-status.enum';
import { CommentTypeEnum } from '../enums/comment-type.enum';

type IUpdateApprovement = {
  isApproved: boolean | null;
  approvedById: number;
  approvedComment: string | null;
};

export type ICommentAggregate = {
  comment: CommentEntity;
  actionPlan: ActionPlanEntity;
  coordinator: CoordinatorEntity | null;
};

export class CommentAggregate {
  comment: CommentEntity;
  actionPlan: ActionPlanEntity;
  coordinator: CoordinatorEntity | null;

  constructor(params: ICommentAggregate) {
    this.actionPlan = params.actionPlan;
    this.comment = params.comment;
    this.coordinator = params.coordinator;
  }

  get isCoordinatorAction() {
    const isDone = this.comment.type === CommentTypeEnum.DONE;
    const isCanceled = this.comment.type === CommentTypeEnum.CANCELED;
    return isDone || isCanceled;
  }

  approve({ approvedById, isApproved, approvedComment }: IUpdateApprovement): [null, string | null] {
    if (this.comment.isApproved === isApproved) return [null, null];

    const isPostponed = this.comment.type === CommentTypeEnum.POSTPONED;
    if (!isApproved) {
      this.comment._approvedAt = null;
      this.actionPlan._status = ActionPlanStatusEnum.REJECTED;
      if (isPostponed) this.actionPlan._validDate = this.comment._previousValidDate;
    } else {
      const isPreviousRejected = this.comment.isApproved === false && this.actionPlan._status === ActionPlanStatusEnum.REJECTED;

      if (isPreviousRejected) {
        this.actionPlan._status = this.comment._currentStatus || ActionPlanStatusEnum.PENDING;
        if (isPostponed) this.actionPlan._validDate = this.comment._currentValidDate;
      }

      this.comment._approvedAt = new Date();
    }

    if (this.comment.isOnlyCoordinatorApproval) {
      const isCoordinator = this.coordinator?.id === approvedById;

      const canNotApprove = isApproved && !isCoordinator;
      if (canNotApprove) return [null, 'Somente o coordenador pode aprovar'];
    }

    this.comment._isApproved = isApproved;
    this.comment._approvedComment = approvedComment;
    this.comment._approvedById = approvedById;

    return [null, null];
  }
}
