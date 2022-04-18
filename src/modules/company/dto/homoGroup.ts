import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateHomoGroupDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @IsOptional()
  @IsString({ each: true })
  readonly hierarchies?: string[];
}

export class UpdateHomoGroupDto extends PartialType(CreateHomoGroupDto) {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString({ each: true })
  readonly hierarchies?: string[];
}
