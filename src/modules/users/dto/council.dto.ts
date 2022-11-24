import { QueryArray } from './../../../shared/transformers/query-array';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UfStateEnum } from '@prisma/client';

export class CouncilDto {
  @IsString()
  councilType: string;

  @ValidateIf((o) => !!o.councilUF)
  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @Transform(QueryArray, { toClassOnly: true })
  @IsEnum(UfStateEnum, {
    message: `UF inválido`,
    each: true,
  })
  councilUF?: string;

  @IsString()
  councilId: string;

  @IsString()
  @IsOptional()
  professionalId?: string;
}
