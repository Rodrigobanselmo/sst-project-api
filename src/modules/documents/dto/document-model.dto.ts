import { IDocumentModelData } from './../types/document-mode.types';
import { QueryArray } from './../../../shared/transformers/query-array';
import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, IsBoolean, IsDefined } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { Types } from 'aws-sdk/clients/applicationautoscaling';

export class CreateDocumentModelDto {
  @IsString()
  companyId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  copyFromId?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;
}

export class UpdateDocumentModelDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsString()
  companyId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  data?: any;

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
}

export class FindDocumentModelDto extends PaginationQueryDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsInt({ each: true })
  id?: number[];

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(DocumentTypeEnum, {
    each: true,
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type?: DocumentTypeEnum[];

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  showInactive?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  all?: boolean;
}

export class IGetDocumentModelData {
  @IsOptional()
  @IsString()
  companyId?: string;
}

export class DownloadPreviewModelData {
  @IsDefined()
  data: IDocumentModelData;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;
}
