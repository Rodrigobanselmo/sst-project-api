import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { CommentTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-type.enum';
import { CommentBrowseResultModel } from '@/@v2/security/action-plan/domain/models/comment/comment-browse-result.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { getOriginHomogeneousGroup } from '@/@v2/shared/domain/functions/security/get-origin-homogeneous-group.func';
import {
  CharacterizationTypeEnum as PrismaCharacterizationTypeEnum,
  HierarchyEnum as PrismaHierarchyEnum,
  HomoTypeEnum as PrismaHomoTypeEnum,
} from '@prisma/client';

export type ICommentBrowseResultModelMapper = {
  comment_id: string;
  comment_is_approved: boolean | null;
  comment_approved_at: Date | null;
  comment_approved_comment: string | null;
  comment_text: string | null;
  comment_type: string;
  comment_text_type: string | null;
  comment_created_at: Date;
  comment_updated_at: Date | null;
  previous_status: ActionPlanStatusEnum | null;
  previous_valid_date: Date | null;
  current_status: ActionPlanStatusEnum | null;
  current_valid_date: Date | null;
  creator_name: string | null;
  creator_email: string | null;
  creator_id: number | null;
  approved_name: string | null;
  approved_email: string | null;
  approved_id: number | null;
  rec_name: string;
  hg_name: string;
  hg_type: PrismaHomoTypeEnum | null;
  cc_name: string | null;
  cc_type: PrismaCharacterizationTypeEnum | null;
  h_type: PrismaHierarchyEnum | null;
  h_name: string | null;
};

export class CommentBrowseResultModelMapper {
  static toModel(prisma: ICommentBrowseResultModelMapper): CommentBrowseResultModel {
    const origin = getOriginHomogeneousGroup({
      name: prisma.hg_name,
      type: prisma.hg_type ? HomoTypeEnum[prisma.hg_type] : null,
      characterization: {
        name: prisma.cc_name,
        type: prisma.cc_type ? CharacterizationTypeEnum[prisma.cc_type] : null,
      },
      hierarchy: {
        name: prisma.h_name,
        type: prisma.h_type ? HierarchyTypeEnum[prisma.h_type] : null,
      },
    });

    return new CommentBrowseResultModel({
      id: prisma.comment_id,
      isApproved: prisma.comment_is_approved,
      approvedAt: prisma.comment_approved_at,
      approvedComment: prisma.comment_approved_comment,
      text: prisma.comment_text,
      type: CommentTypeEnum[prisma.comment_type],
      textType: prisma.comment_text_type ? CommentTextTypeEnum[prisma.comment_text_type] : null,
      origin,
      createdAt: prisma.comment_created_at,
      updatedAt: prisma.comment_updated_at,
      recommendation: {
        name: prisma.rec_name,
      },
      createdBy:
        prisma.creator_name && prisma.creator_email && prisma.creator_id
          ? {
              name: prisma.creator_name,
              email: prisma.creator_email,
              id: prisma.creator_id,
            }
          : null,
      changes: {
        status: prisma.current_status ? ActionPlanStatusEnum[prisma.current_status] : undefined,
        validDate: prisma.current_valid_date || undefined,
        previousStatus: prisma.previous_status ? ActionPlanStatusEnum[prisma.previous_status] : undefined,
        previousValidDate: prisma.previous_valid_date || undefined,
      },
      approvedBy:
        prisma.approved_name && prisma.approved_email && prisma.approved_id
          ? {
              name: prisma.approved_name,
              email: prisma.approved_email,
              id: prisma.approved_id,
            }
          : null,
    });
  }

  static toModels(prisma: ICommentBrowseResultModelMapper[]): CommentBrowseResultModel[] {
    return prisma.map((rec) => CommentBrowseResultModelMapper.toModel(rec));
  }
}
