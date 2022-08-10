import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { PartialType } from '@nestjs/swagger';
import { ExamTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateExamDto {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  analyses?: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  esocial27Code?: string;

  @IsBoolean()
  @IsString()
  isAttendance?: boolean;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(ExamTypeEnum, {
    message: `Tipo de exame inválidp`,
  })
  type?: ExamTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  // @IsOptional()
  // @IsString({ each: true })
  // riskIds: string[];
}

export class UpdateExamDto extends PartialType(CreateExamDto) {}

export class UpsertExamDto extends CreateExamDto {
  @IsInt()
  @IsOptional()
  id: number;
}

export class FindExamDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
