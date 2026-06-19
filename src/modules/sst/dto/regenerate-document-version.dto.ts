import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';

export class RegenerateDocumentProfessionalSnapshotDto {
  @IsNumber()
  professionalId: number;

  @IsOptional()
  isSigner?: boolean;

  @IsOptional()
  isElaborator?: boolean;
}

export class RegenerateDocumentVersionDto {
  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  documentDate?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsString()
  elaboratedBy?: string;

  @IsOptional()
  @IsString()
  revisionBy?: string;

  @IsOptional()
  @IsString()
  coordinatorBy?: string;

  @IsOptional()
  @IsString()
  legalResponsibleBy?: string;

  @IsOptional()
  @IsNumber()
  modelId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ghoIds?: string[];

  @IsOptional()
  @IsString()
  filterViewType?: string;

  @IsOptional()
  @IsArray()
  selectedFilters?: Array<{ id: string; name?: string }>;

  @IsOptional()
  json?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegenerateDocumentProfessionalSnapshotDto)
  professionalSignatures?: RegenerateDocumentProfessionalSnapshotDto[];
}
