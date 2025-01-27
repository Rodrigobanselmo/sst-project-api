import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class EditManyCommentPayload {
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  ids!: string[];

  @IsBoolean()
  @Type(() => Boolean)
  @ValidateIf((o) => o.isApproved !== null)
  isApproved!: boolean | null;

  @IsString()
  @IsOptional()
  approvedComment?: string | null;
}
