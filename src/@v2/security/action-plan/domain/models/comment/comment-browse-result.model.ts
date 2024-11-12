import { CommentTextTypeEnum } from "../../enums/comment-text-type.enum";
import { CommentTypeEnum } from "../../enums/comment-type.enum";

export type ICommentBrowseResultModel = {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;

    text: string | null;
    type: CommentTypeEnum;
    textType: CommentTextTypeEnum | null;
    isApproved: boolean | null;
    approvedAt: Date | null;
    approvedComment: string | null;

    approvedBy: { id: number; name: string; email: string } | null;
    createdBy: { id: number; name: string; email: string; } | null
}

export class CommentBrowseResultModel {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;

    text: string | null;
    type: CommentTypeEnum;
    textType: CommentTextTypeEnum | null;
    isApproved: boolean | null;
    approvedAt: Date | null;
    approvedComment: string | null;

    approvedBy: { id: number; name: string; email: string } | null;
    createdBy: { id: number; name: string; email: string; } | null

    constructor(params: ICommentBrowseResultModel) {
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;

        this.text = params.text;
        this.type = params.type;
        this.textType = params.textType;
        this.isApproved = params.isApproved;
        this.approvedAt = params.approvedAt;
        this.approvedComment = params.approvedComment;

        this.approvedBy = params.approvedBy;
        this.createdBy = params.createdBy;
    }
}