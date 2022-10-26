import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

import { QueryArray } from './../../../shared/transformers/query-array';

export class CreateProtocolDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  companyId?: string;
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
}

export class FindProtocolDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
