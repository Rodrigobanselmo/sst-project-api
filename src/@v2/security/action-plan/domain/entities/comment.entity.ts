import { CommentTextTypeEnum } from "../enums/comment-text-type.enum";
import { CommentTypeEnum } from "../enums/comment-type.enum";

export type ICommentEntity = {
  id?: string;
  text: string
  textType: CommentTextTypeEnum
  type: CommentTypeEnum;
  commentedById: number;

  isApproved?: boolean | null;
  approvedAt?: Date | null;
  approvedComment?: string | null;
  approvedById?: number | null;
}

export class CommentEntity {
  id: string | null;
  text: string | null;
  textType: CommentTextTypeEnum | null;
  type: CommentTypeEnum;
  commentedById: number;

  _isApproved: boolean | null;
  _approvedAt: Date | null;
  _approvedComment: string | null;
  _approvedById: number | null;

  constructor(params: ICommentEntity) {
    this.id = params.id || null;
    this.text = params.text;
    this.textType = params.textType;
    this.type = params.type;
    this.commentedById = params.commentedById;

    this._isApproved = params.isApproved || null;
    this._approvedAt = params.approvedAt || null;
    this._approvedComment = params.approvedComment || null;
    this._approvedById = params.approvedById || null;
  }


  get isApproved() {
    return this._isApproved;
  }

  get approvedAt() {
    return this._approvedAt;
  }

  get approvedComment() {
    return this._approvedComment;
  }

  get approvedById() {
    return this._approvedById;
  }
}