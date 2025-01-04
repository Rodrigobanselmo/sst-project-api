import { IOrderBy } from "@/@v2/shared/types/order-by.types";
import { CommentTextTypeEnum } from "../../../domain/enums/comment-text-type.enum";
import { CommentTypeEnum } from "../../../domain/enums/comment-type.enum";

export enum CommentOrderByEnum {
  CREATOR = 'CREATOR',
  IS_APPROVED = 'IS_APPROVED',
  APPROVED_BY = 'APPROVED_BY',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  TEXT_TYPE = 'TEXT_TYPE',
  TYPE = 'TYPE',
}

export namespace ICommentDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<CommentOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      workspaceIds?: string[];
      creatorsIds?: number[];
      isApproved?: boolean | null;
      type?: CommentTypeEnum[];
      textType?: CommentTextTypeEnum[];
    };
  }
}

