import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { ActionPlanEntity } from '../entities/action-plan.entity';
import { CommentEntity } from '../entities/comment.entity';
import { ActionPlanStatusEnum } from '../enums/action-plan-status.enum';
import { CommentTextTypeEnum } from '../enums/comment-text-type.enum';
import { CommentTypeEnum } from '../enums/comment-type.enum';
import { errorCommentRequired, errorCommentTextRequired } from '../errors/diagnose.errors';
import { CoordinatorEntity } from '../entities/coordinator.entity';

type ISetStatus = {
  comment?: {
    text?: string;
    textType?: CommentTextTypeEnum;
    commentedById: number;
  };
  status: ActionPlanStatusEnum;
};

type ISetValidDate = {
  comment: {
    text?: string;
    textType?: CommentTextTypeEnum;
    commentedById: number;
  };
  validDate: Date | null;
};

export type IActionPlanAggregate = {
  actionPlan: ActionPlanEntity;
  comments: CommentEntity[];
  coordinator: CoordinatorEntity | null;
};

export class ActionPlanAggregate {
  actionPlan: ActionPlanEntity;
  comments: CommentEntity[];
  coordinator: CoordinatorEntity | null;

  constructor(params: IActionPlanAggregate) {
    this.actionPlan = params.actionPlan;
    this.comments = params.comments;
    this.coordinator = params.coordinator;
  }

  setValidDate({ validDate, comment }: ISetValidDate): DomainResponse {
    if (!comment.text || !comment.textType) return [, errorCommentTextRequired];

    const isCoordinator = this.coordinator?.id === comment.commentedById;

    this.comments.push(
      new CommentEntity({
        text: comment.text,
        textType: comment.textType,
        commentedById: comment.commentedById,
        type: CommentTypeEnum.POSTPONED,
        previousStatus: this.actionPlan.status,
        previousValidDate: this.actionPlan.validDate,
        currentStatus: this.actionPlan.status,
        currentValidDate: validDate,
        ...(isCoordinator && {
          isApproved: true,
          approvedAt: new Date(),
          approvedById: comment.commentedById,
        }),
      }),
    );

    this.actionPlan._validDate = validDate;

    return [, null];
  }

  setStatus({ status, comment }: ISetStatus): DomainResponse {
    const isCoordinator = this.coordinator?.id === comment.commentedById;

    if (status === ActionPlanStatusEnum.DONE) {
      if (!comment) return [, errorCommentRequired];

      this.actionPlan._doneDate = new Date();
      this.comments.push(
        new CommentEntity({
          text: comment.text || null,
          textType: comment.textType || null,
          commentedById: comment.commentedById,
          type: CommentTypeEnum.DONE,
          previousStatus: this.actionPlan.status,
          currentStatus: status,
          currentValidDate: null,
          previousValidDate: null,
          ...(isCoordinator && {
            isApproved: true,
            approvedAt: new Date(),
            approvedById: comment.commentedById,
          }),
        }),
      );
    } else if (status === ActionPlanStatusEnum.PROGRESS) {
      this.actionPlan._startDate = new Date();
      this.comments.push(
        new CommentEntity({
          text: comment.text || null,
          textType: comment.textType || null,
          commentedById: comment.commentedById,
          type: CommentTypeEnum.PROGRESS,
          previousStatus: this.actionPlan.status,
          currentStatus: status,
          currentValidDate: null,
          previousValidDate: null,
        }),
      );
    } else if (status === ActionPlanStatusEnum.PENDING) {
      this.actionPlan._startDate = null;
      this.actionPlan._doneDate = null;
      this.actionPlan._canceledDate = null;
    } else if (status === ActionPlanStatusEnum.CANCELED) {
      if (!comment) return [, errorCommentRequired];
      if (!comment.text || !comment.textType) return [, errorCommentTextRequired];

      this.actionPlan._canceledDate = new Date();
      this.comments.push(
        new CommentEntity({
          text: comment.text,
          textType: comment.textType,
          commentedById: comment.commentedById,
          previousStatus: this.actionPlan.status,
          previousValidDate: null,
          currentStatus: status,
          currentValidDate: null,
          type: CommentTypeEnum.CANCELED,
          ...(isCoordinator && {
            isApproved: true,
            approvedAt: new Date(),
            approvedById: comment.commentedById,
          }),
        }),
      );
    }

    this.actionPlan._status = status;
    return [, null];
  }
}
