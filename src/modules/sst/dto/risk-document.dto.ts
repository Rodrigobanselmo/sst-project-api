import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Prisma } from '@prisma/client';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { AttachmentDto } from './attachment.dto';

export class UpsertRiskDocumentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  documentDataId: string;

  @IsString()
  version: string;

  @IsString()
  workspaceId: string;

  @IsString()
  workspaceName: string;

  @IsString()
  fileUrl?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsOptional()
  @IsString()
  companyId: string;

  /** Data de emissão formal exibida no documento (distinta de created_at). */
  @IsOptional()
  @IsDateString()
  documentDate?: string;

  @IsOptional()
  officialRevisionSeries?: number | null;

  @IsOptional()
  @IsString()
  approvedBy?: string | null;

  @IsOptional()
  @IsString()
  revisionBy?: string | null;

  @IsOptional()
  @IsString()
  elaboratedBy?: string | null;

  @IsOptional()
  @IsDateString()
  documentCreatedAt?: string;

  @IsOptional()
  validityYears?: number | null;

  @IsOptional()
  validityMonths?: number | null;

  @IsOptional()
  @IsDateString()
  validityEndSnapshot?: string;

  @IsOptional()
  generationSnapshot?: Prisma.InputJsonValue;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
