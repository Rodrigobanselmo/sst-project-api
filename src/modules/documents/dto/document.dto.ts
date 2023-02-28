import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class UpsertDocumentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  documentDataId: string;

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
}

export class UploadDocumentDto extends UpsertDocumentDto {
  @IsOptional()
  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;
}

export class IGetDocumentModel {
  @IsString()
  companyId: string;

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
