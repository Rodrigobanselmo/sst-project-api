import { DomainError } from "@/@v2/shared/domain/error/domain-error.error";
import { ActionPlanStatusEnum } from "../enums/action-plan-status.enum";
import { CommentTextTypeEnum } from "../enums/comment-text-type.enum";
import { CommentTypeEnum } from "../enums/comment-type.enum";
import { errorCommentRequired, errorCommentTextRequired } from "../errors/diagnose.errors";
import { DomainResponse } from "@/@v2/shared/domain/types/shared/domain-response";
import { updateField } from "@/@v2/shared/domain/helpers/update-field.helper";
import { ActionPlanEntity, IActionPlanEntity } from "../entities/action-plan.entity";
import { CommentEntity } from "../entities/comment.entity";

type ISetStatus = {
  comment?: {
    text?: string
    textType?: CommentTextTypeEnum
    commentedById: number;
  }
  status: ActionPlanStatusEnum
}

type ISetValidDate = {
  comment: {
    text?: string
    textType?: CommentTextTypeEnum
    commentedById: number;
  }
  validDate: Date | null
}

export type IActionPlanAggregate = IActionPlanEntity & {
  comments: CommentEntity[]
}

export class ActionPlanAggregate extends ActionPlanEntity {
  comments: CommentEntity[]

  constructor(params: IActionPlanAggregate) {
    super(params);
    this.comments = params.comments;
  }

  setValidDate({ validDate, comment }: ISetValidDate): DomainResponse {
    if (!comment.text || !comment.textType) return [, errorCommentTextRequired];

    this.comments.push(new CommentEntity({
      text: comment.text,
      textType: comment.textType,
      commentedById: comment.commentedById,
      type: CommentTypeEnum.POSTPONED,
    }));

    this._validDate = validDate;

    return [, null];
  }

  setStatus({ status, comment }: ISetStatus): DomainResponse {
    if (status === ActionPlanStatusEnum.DONE) {
      if (!comment) return [, errorCommentRequired];

      this._doneDate = new Date();
      this.comments.push(new CommentEntity({
        text: comment.text || null,
        textType: comment.textType || null,
        commentedById: comment.commentedById,
        type: CommentTypeEnum.DONE,
      }));
    }

    else if (status === ActionPlanStatusEnum.PROGRESS) {
      this._startDate = new Date();
    }

    else if (status === ActionPlanStatusEnum.PENDING) {
      this._startDate = null;
      this._doneDate = null;
      this._canceledDate = null;
    }

    else if (status === ActionPlanStatusEnum.CANCELED) {
      if (!comment) return [, errorCommentRequired];
      if (!comment.text || !comment.textType) return [, errorCommentTextRequired];

      this._canceledDate = new Date();
      this.comments.push(new CommentEntity({
        text: comment.text,
        textType: comment.textType,
        commentedById: comment.commentedById,
        type: CommentTypeEnum.CANCELED,
      }));

    }

    this._status = status;
    return [, null];
  }
}