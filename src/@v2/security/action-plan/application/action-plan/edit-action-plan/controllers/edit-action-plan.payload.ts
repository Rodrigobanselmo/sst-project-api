import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';


class Comment {
  @IsString()
  @IsOptional()
  text?: string;

  @IsEnum(CommentTextTypeEnum)
  @IsOptional()
  textType?: CommentTextTypeEnum;
}

export class EditActionPlanPayload {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;

  @IsInt()
  @IsOptional()
  responsibleId?: number | null;

  @IsDate()
  @IsOptional()
  validDate?: Date | null;

  @IsEnum(ActionPlanStatusEnum)
  @IsOptional()
  status?: ActionPlanStatusEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => Comment)
  comment?: Comment;
}


