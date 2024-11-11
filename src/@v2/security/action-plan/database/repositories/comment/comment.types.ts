import { CommentEntity } from "../../../domain/entities/comment.entity";

export interface ICommentRepository {
  findById(params: ICommentRepository.FindByIdParams): ICommentRepository.FindByIdReturn
  update(params: ICommentRepository.UpdateParams): ICommentRepository.UpdateReturn
  updateMany(params: ICommentRepository.UpdateManyParams): ICommentRepository.UpdateManyReturn
}

export namespace ICommentRepository {
  export type FindByIdParams = { companyId: string; id: string; }
  export type FindByIdReturn = Promise<CommentEntity | null>

  export type UpdateParams = CommentEntity
  export type UpdateReturn = Promise<CommentEntity | null>

  export type UpdateManyParams = {
    ids: string[];
    isApproved?: boolean | null;
    approvedAt?: Date | null;
    approvedComment?: string | null;
    approvedById?: number | null;
  }
  export type UpdateManyReturn = Promise<void>
}