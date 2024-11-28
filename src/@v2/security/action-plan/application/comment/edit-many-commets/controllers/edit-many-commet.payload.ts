import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';


export class EditManyCommentPayload {
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  ids: string[];

  @IsBoolean()
  @Type(() => Boolean)
  isApproved: boolean;

  @IsString()
  @IsOptional()
  approvedComment?: string | null;
}

