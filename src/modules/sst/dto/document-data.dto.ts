import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ToBoolean } from '../../../shared/decorators/boolean.decorator';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class UpsertDocumentDataDto {
  @IsString()
  @IsOptional()
  id?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsOptional()
  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;

  @IsOptional()
  @IsString()
  companyId: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  elaboratedBy?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  revisionBy?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  coordinatorBy?: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validityEnd?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  validityStart?: Date;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProfessionalDocumentDataDto)
  professionals?: ProfessionalDocumentDataDto[];
}

export class ProfessionalDocumentDataDto {
  @IsOptional()
  @IsString()
  documentDataId: string;

  @IsInt()
  professionalId: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isSigner: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isElaborator: boolean;
}

export class FindOneDocumentDataDto extends PaginationQueryDto {
  @IsString()
  @IsEnum(DocumentTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(DocumentTypeEnum)}`,
  })
  type: DocumentTypeEnum;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  companyId: string;
}
