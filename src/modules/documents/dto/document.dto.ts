import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class UpsertDocumentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  documentDataId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ghoIds?: string[];

  @IsOptional()
  @IsString()
  filterViewType?: string;

  @IsOptional()
  selectedFilters?: Array<{ id: string; name?: string }>;

  @IsString()
  name: string;

  @IsString()
  version: string;

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

  @IsString()
  workspaceId: string;

  @IsString()
  workspaceName: string;

  /** Data de emissão formal exibida no documento (distinta de created_at). */
  @IsOptional()
  @IsDateString()
  documentDate?: string;
}

export class UploadDocumentDto extends UpsertDocumentDto {
  @IsOptional()
  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;
}

export class UploadPgrActionPlanDto {
  @IsString()
  riskGroupId: string;

  @IsOptional()
  @IsString()
  companyId: string;

  @IsString()
  workspaceId: string;
}
