import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class UpsertDocumentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  riskGroupId: string;

  @IsOptional()
  @IsString()
  pcmsoId: string;

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

  @IsOptional()
  @IsBoolean()
  isPGR: boolean;
  @IsOptional()
  @IsBoolean()
  isPCMSO: boolean;
}

export class UpsertPgrDocumentDto extends UpsertDocumentDto {}

export class UpsertPcmsoDocumentDto extends UpsertDocumentDto {}

export class UploadPgrActionPlanDto {
  @IsString()
  riskGroupId: string;

  @IsOptional()
  @IsString()
  companyId: string;

  @IsString()
  workspaceId: string;
}
