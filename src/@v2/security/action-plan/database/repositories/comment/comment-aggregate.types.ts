import { CommentAggregate } from "../../../domain/aggregations/comment.aggregate";

export interface ICommentAggregateRepository {
  findById(params: ICommentAggregateRepository.FindByIdParams): ICommentAggregateRepository.FindByIdReturn
  update(params: ICommentAggregateRepository.UpdateParams): ICommentAggregateRepository.UpdateReturn
  updateMany(params: ICommentAggregateRepository.UpdateManyParams): ICommentAggregateRepository.UpdateManyReturn
}

export namespace ICommentAggregateRepository {
  export type FindByIdParams = { companyId: string; id: string; }
  export type FindByIdReturn = Promise<CommentAggregate | null>

  export type UpdateParams = CommentAggregate
  export type UpdateReturn = Promise<CommentAggregate | null>

  export type UpdateManyParams = CommentAggregate[]
  export type UpdateManyReturn = Promise<void>
}