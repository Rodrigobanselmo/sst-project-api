import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class CreateEpiDto {
  @IsString()
  ca: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  equipment: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  national?: boolean;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  report?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  restriction?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  observation?: string;

  @IsDate()
  @Type(() => Date)
  expiredDate?: Date;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
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
