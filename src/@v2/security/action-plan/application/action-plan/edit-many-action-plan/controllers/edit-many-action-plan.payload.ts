import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';


class Comment {
  @IsString()
  text!: string;

  @IsEnum(CommentTextTypeEnum)
  textType!: CommentTextTypeEnum;
}

class Identifier {
  @IsString()
  recommendationId!: string;

  @IsString()
  riskDataId!: string;

  @IsString()
  workspaceId!: string;
}

export class EditActionPlanPayload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Identifier)
  ids: Identifier[];

  @IsString()
  @IsOptional()
  responsibleId?: number | null;

  @IsString()
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


