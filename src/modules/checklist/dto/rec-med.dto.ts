import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StringUppercaseTransform } from 'src/shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';

export class CreateRecMedDto {
  @IsNumber()
  riskId: number;

  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;
}

export class UpsertRecMedDto extends CreateRecMedDto {
  @IsNumber()
  @IsOptional()
  id: number;
}

export class UpdateRecMedDto {
  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;
}

export class RiskCreateRecMedDto {
  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;
}

export class RiskUpdateRecMedDto extends PartialType(RiskCreateRecMedDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
