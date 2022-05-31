import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateEpiDto {
  @IsString()
  ca: string;

  @IsString()
  equipment: string;

  @IsBoolean()
  @IsOptional()
  national?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  report?: string;

  @IsOptional()
  @IsString()
  restriction?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsDate()
  @Type(() => Date)
  expiredDate?: Date;

  @IsOptional()
  @IsBoolean()
  isValid?: boolean;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;
}

export class UpsertEpiDto extends CreateEpiDto {
  @IsString()
  @IsOptional()
  id: string;
}

export class UpdateEpiDto extends PartialType(CreateEpiDto) {}

export class FindEpiDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  ca?: string;

  @IsString()
  @IsOptional()
  equipment?: string;
}
