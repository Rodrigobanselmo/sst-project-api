import { RiskFactorDataRecComments } from '@prisma/client';
import { CommentEntity } from '../../../domain/entities/comment.entity';
import { CommentTextTypeEnum } from '../../../domain/enums/comment-text-type.enum';
import { CommentTypeEnum } from '../../../domain/enums/comment-type.enum';

export type ICommentEntityMapper = RiskFactorDataRecComments

export class CommentMapper {
  static toArrayEntity(data: ICommentEntityMapper[]): CommentEntity[] {
    return data.map((item) => CommentMapper.toEntity(item))
  }

  static toEntity(data: ICommentEntityMapper): CommentEntity {
    return new CommentEntity({
      id: data.id,
      text: data.text,
      type: CommentTypeEnum[data.type],
      commentedById: data.userId,
      textType: CommentTextTypeEnum[data.textType],
      approvedAt: data.approvedAt,
      approvedById: data.approvedById,
      approvedComment: data.approvedComment,
      isApproved: data.isApproved
    })
  }
}
