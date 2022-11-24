import { KeysOfEnum } from './../../../shared/utils/keysOfEnum.utils';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';

import { QueryArray } from './../../../shared/transformers/query-array';
import { StatusEnum } from '@prisma/client';

export class CreateProtocolDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  system?: boolean;
}

export class UpdateProtocolDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  companyId: string;
}

export class UpdateProtocolRiskDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsInt({ each: true })
  protocolIds?: number[];

  @IsString()
  companyId: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  riskIds: string[];

  @IsNumber()
  @IsOptional()
  minRiskDegree?: number;

  @IsNumber()
  @IsOptional()
  minRiskDegreeQuantity?: number;
}

export class FindProtocolDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
