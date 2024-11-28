import { ActionPlanStatusEnum } from "@/@v2/security/action-plan/domain/enums/action-plan-status.enum";
import { CommentTextTypeEnum } from "@/@v2/security/action-plan/domain/enums/comment-text-type.enum";
import { CommentTypeEnum } from "@/@v2/security/action-plan/domain/enums/comment-type.enum";
import { CommentBrowseResultModel } from "@/@v2/security/action-plan/domain/models/comment/comment-browse-result.model";
import { StatusEnum } from "@prisma/client";

export type ICommentBrowseResultModelMapper = {
  comment_id: string
  comment_is_approved: boolean | null;
  comment_approved_at: Date | null;
  comment_approved_comment: string | null;
  comment_text: string | null;
  comment_type: string
  comment_text_type: string | null;
  comment_created_at: Date
  comment_updated_at: Date | null;
  creator_name: string | null;
  creator_email: string | null;
  creator_id: number | null;
  approved_name: string | null;
  approved_email: string | null;
  approved_id: number | null;
  rfs_rec_status: StatusEnum | null;
  rfs_rec_valid_date: Date | null;
}

export class CommentBrowseResultModelMapper {
  static toModel(prisma: ICommentBrowseResultModelMapper): CommentBrowseResultModel {
    return new CommentBrowseResultModel({
      id: prisma.comment_id,
      isApproved: prisma.comment_is_approved,
      approvedAt: prisma.comment_approved_at,
      approvedComment: prisma.comment_approved_comment,
      text: prisma.comment_text,
      type: CommentTypeEnum[prisma.comment_type],
      textType: prisma.comment_text_type ? CommentTextTypeEnum[prisma.comment_text_type] : null,
      createdAt: prisma.comment_created_at,
      updatedAt: prisma.comment_updated_at,
      createdBy: prisma.creator_name && prisma.creator_email && prisma.creator_id ? {
        name: prisma.creator_name,
        email: prisma.creator_email,
        id: prisma.creator_id,
      } : null,
      changes: {
        status: prisma.rfs_rec_status ? ActionPlanStatusEnum[prisma.rfs_rec_status] : undefined,
        validDate: prisma.rfs_rec_valid_date || undefined,
      },
      approvedBy: prisma.approved_name && prisma.approved_email && prisma.approved_id ? {
        name: prisma.approved_name,
        email: prisma.approved_email,
        id: prisma.approved_id,
      } : null,
    })
  }

  static toModels(prisma: ICommentBrowseResultModelMapper[]): CommentBrowseResultModel[] {
    return prisma.map((rec) => CommentBrowseResultModelMapper.toModel(rec))
  }
}
