import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { CommentTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-type.enum';
import { ActionPlanBrowseResultModel } from '@/@v2/security/action-plan/domain/models/action-plan/action-plan-browse-result.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { RecommendationTypeEnum } from '@/@v2/shared/domain/enum/security/recommendation-type.enum';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { IRiskLevelValues } from '@/@v2/shared/domain/types/security/risk-level-values.type';
import {
  RiskFactorsEnum,
  HomoTypeEnum as PrismaHomoTypeEnum,
  HierarchyEnum as PrismaHierarchyEnum,
  CharacterizationTypeEnum as PrismaCharacterizationTypeEnum,
  RecTypeEnum as PrismaRecTypeEnum,
} from '@prisma/client';

export type IActionPlanBrowseResultModelMapper = {
  rec_id: string;
  rec_name: string;
  rec_type: PrismaRecTypeEnum;
  rfd_id: string;
  rfd_created_at: Date;
  rfd_level: number | null;
  rfd_rec_updated_at: Date | null;
  rfd_rec_start_date: Date | null;
  rfd_rec_done_date: Date | null;
  rfd_rec_canceled_date: Date | null;
  rfd_rec_end_date: Date | null;
  rfd_rec_status: ActionPlanStatusEnum | null;
  w_id: string;
  w_name: string;
  validity_start: Date | null;
  validity_end: Date | null;
  months_period_level_2: number;
  months_period_level_3: number;
  months_period_level_4: number;
  months_period_level_5: number;
  risk_name: string;
  risk_id: string;
  risk_type: RiskFactorsEnum;
  hg_id: string;
  hg_name: string;
  hg_type: PrismaHomoTypeEnum | null;
  cc_name: string | null;
  cc_type: PrismaCharacterizationTypeEnum | null;
  h_type: PrismaHierarchyEnum | null;
  h_name: string | null;
  resp_id: string | null;
  resp_name: string | null;
  generatesources: {
    id: string;
    name: string;
  }[];
  comments: {
    id: string;
    text: string | null;
    type: string;
    text_type: string | null;
    approved_comment: string | null;
    is_approved: boolean | null;
    created_at: Date;
  }[];
};

export class ActionPlanBrowseResultModelMapper {
  static toModel(prisma: IActionPlanBrowseResultModelMapper): ActionPlanBrowseResultModel {
    return new ActionPlanBrowseResultModel({
      canceledDate: prisma.rfd_rec_canceled_date,
      createdAt: prisma.rfd_created_at,
      doneDate: prisma.rfd_rec_done_date,
      ocupationalRisk: prisma.rfd_level as IRiskLevelValues,
      startDate: prisma.rfd_rec_start_date,
      status: prisma.rfd_rec_status ? ActionPlanStatusEnum[prisma.rfd_rec_status] : ActionPlanStatusEnum.PENDING,
      updatedAt: prisma.rfd_rec_updated_at,
      uuid: {
        recommendationId: prisma.rec_id,
        riskDataId: prisma.rfd_id,
        workspaceId: prisma.w_id,
      },
      responsible:
        prisma.resp_id && prisma.resp_name
          ? {
              id: prisma.resp_id,
              name: prisma.resp_name,
            }
          : null,
      homogeneousGroup: {
        id: prisma.hg_id,
        name: prisma.hg_name,
        type: prisma.hg_type ? HomoTypeEnum[prisma.hg_type] : null,
        characterization:
          prisma.cc_name && prisma.cc_type
            ? {
                name: prisma.cc_name,
                type: CharacterizationTypeEnum[prisma.cc_type],
              }
            : null,
        hierarchy:
          prisma.h_name && prisma.h_type
            ? {
                name: prisma.h_name,
                type: HierarchyTypeEnum[prisma.h_type],
              }
            : null,
      },
      endDate: prisma.rfd_rec_end_date,
      validityStart: prisma.validity_start,
      periods: {
        monthsLevel_2: prisma.months_period_level_2,
        monthsLevel_3: prisma.months_period_level_3,
        monthsLevel_4: prisma.months_period_level_4,
        monthsLevel_5: prisma.months_period_level_5,
      },
      risk: {
        id: prisma.risk_id,
        name: prisma.risk_name,
        type: RiskTypeEnum[prisma.risk_type],
      },
      recommendation: {
        name: prisma.rec_name,
        type: RecommendationTypeEnum[prisma.rec_type],
      },
      generateSources: prisma.generatesources.map((generateSource) => ({
        name: generateSource.name,
        id: generateSource.id,
      })),
      comments: prisma.comments.map((comment) => ({
        id: comment.id,
        text: comment.text,
        type: CommentTypeEnum[comment.type],
        textType: comment.text_type ? CommentTextTypeEnum[comment.text_type] : null,
        approvedComment: comment.approved_comment,
        isApproved: comment.is_approved,
        createdAt: comment.created_at,
      })),
    });
  }

  static toModels(prisma: IActionPlanBrowseResultModelMapper[]): ActionPlanBrowseResultModel[] {
    return prisma.map((rec) => ActionPlanBrowseResultModelMapper.toModel(rec));
  }
}
