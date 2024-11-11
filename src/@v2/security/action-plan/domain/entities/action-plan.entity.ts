import { DomainError } from "@/@v2/shared/domain/error/domain-error.error";
import { ActionPlanStatusEnum } from "../enums/action-plan-status.enum";
import { CommentTextTypeEnum } from "../enums/comment-text-type.enum";
import { CommentTypeEnum } from "../enums/comment-type.enum";
import { errorCommentRequired, errorCommentTextRequired } from "../errors/diagnose.errors";
import { CommentEntity } from "./comment.entity";
import { DomainResponse } from "@/@v2/shared/domain/types/shared/domain-response";
import { updateField } from "@/@v2/shared/domain/helpers/update-field.helper";

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

export type IActionPlanEntity = {
  companyId: string
  recommendationId: string
  riskDataId: string
  workspaceId: string

  status: ActionPlanStatusEnum;
  startDate: Date | null
  doneDate: Date | null
  canceledDate?: Date | null
  responsibleId?: number | null
  validDate: Date | null

  comments: CommentEntity[]
}

export class ActionPlanEntity {
  readonly companyId: string
  readonly recommendationId: string
  readonly riskDataId: string
  readonly workspaceId: string

  protected _responsibleId: number | null
  protected _status: ActionPlanStatusEnum;
  protected _startDate: Date | null
  protected _doneDate: Date | null
  protected _canceledDate: Date | null
  protected _validDate: Date | null

  comments: CommentEntity[]

  constructor(params: IActionPlanEntity) {
    this.companyId = params.companyId;
    this.recommendationId = params.recommendationId;
    this.riskDataId = params.riskDataId;
    this.workspaceId = params.workspaceId;

    this._responsibleId = params.responsibleId;
    this._status = params.status;
    this._startDate = params.startDate;
    this._doneDate = params.doneDate;
    this._canceledDate = params.canceledDate;
    this._validDate = params.validDate;

    this.comments = params.comments;
  }

  get responsibleId() {
    return this._responsibleId;
  }

  set responsibleId(responsibleId: number | null | undefined) {
    this._responsibleId = updateField(responsibleId, this._responsibleId);
  }

  get startDate() {
    return this._startDate;
  }

  get doneDate() {
    return this._doneDate;
  }

  get canceledDate() {
    return this._canceledDate;
  }

  get status() {
    return this._status;
  }

  get validDate() {
    return this._validDate;
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