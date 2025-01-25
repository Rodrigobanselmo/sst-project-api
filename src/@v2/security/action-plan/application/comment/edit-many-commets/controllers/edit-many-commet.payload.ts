import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditManyCommentPayload {
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  ids!: string[];

  @IsBoolean()
  @Type(() => Boolean)
  isApproved!: boolean;

  @IsString()
  @IsOptional()
  approvedComment?: string | null;
}
