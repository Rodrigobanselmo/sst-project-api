import { CommentOrderByEnum } from '@/@v2/security/action-plan/database/dao/comment/comment.types';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { CommentTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-type.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IBrowseCommentsUseCase {
  export type Params = {
    companyId: string;
    orderBy?: IOrderBy<CommentOrderByEnum>;
    pagination: IPagination;
    search?: string;
    workspaceIds?: string[];
    creatorsIds?: number[];
    isApproved?: boolean | null;
    type?: CommentTypeEnum[];
    textType?: CommentTextTypeEnum[];
    generateSourceIds?: string[];
  };
}
