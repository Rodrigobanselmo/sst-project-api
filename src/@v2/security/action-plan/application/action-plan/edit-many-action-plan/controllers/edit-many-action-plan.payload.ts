import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { CommentTextTypeEnum } from '@/@v2/security/action-plan/domain/enums/comment-text-type.enum';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';


class Comment {
  @IsString()
  @IsOptional()
  text?: string;

  @IsEnum(CommentTextTypeEnum)
  @IsOptional()
  textType?: CommentTextTypeEnum;
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


