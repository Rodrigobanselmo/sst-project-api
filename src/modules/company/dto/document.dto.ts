import { QueryArray } from './../../../shared/transformers/query-array';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { DateFormat } from './../../../shared/transformers/date-format';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsString()
  name?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status: StatusEnum;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Transform(DateFormat, { toClassOnly: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsOptional()
  @IsInt()
  parentDocumentId?: number;

  // @ValidateNested({ each: true })
  // @IsOptional()
  // @Type(() => UpdateDocumentDto)
  // oldDocuments?: UpdateDocumentDto[];
}

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsInt()
  parentDocumentId?: number;
}

export class FindDocumentDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type?: DocumentTypeEnum[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status: StatusEnum;
}
