import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';


export class EditManyCommentPayload {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  ids?: number[];

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;

  @IsString()
  @IsOptional()
  approvedComment?: string | null;
}


