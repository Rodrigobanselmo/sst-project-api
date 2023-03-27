import { QueryArray } from './../../../shared/transformers/query-array';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UfStateEnum } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

export class CouncilDto {
  @IsString()
  councilType: string;

  @ValidateIf((o) => o.councilUF != '')
  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsEnum(UfStateEnum, {
    message: `UF inválido`,
  })
  councilUF?: string;

  @IsString()
  councilId: string;

  @IsInt()
  @IsOptional()
  professionalId?: number;

  @IsInt()
  @IsOptional()
  id?: number;
}

export class CreateCouncilDto {
  @IsString()
  councilType: string;

  @ValidateIf((o) => o.councilUF != '')
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsEnum(UfStateEnum, {
    message: `UF inválido`,
  })
  councilUF?: string;

  @IsString()
  councilId: string;

  @IsInt()
  professionalId: number;
}

export class UpdateCouncilDto extends PartialType(CreateCouncilDto) {
  @IsInt()
  id: number;
}
