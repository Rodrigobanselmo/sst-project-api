import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class CreateProtocolToRiskDto {
  @IsInt()
  protocolId: number;

  @IsString()
  riskId: string;

  @IsString()
  companyId: string;

  @IsInt()
  @IsOptional()
  minRiskDegree: number;

  @IsInt()
  @IsOptional()
  minRiskDegreeQuantity: number;
}

export class UpdateProtocolToRiskDto extends PartialType(CreateProtocolToRiskDto) {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class CopyProtocolToRiskDto {
  @IsString()
  fromCompanyId: string;

  @IsString()
  companyId: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  overwrite?: boolean;
}

export class UpsertManyProtocolToRiskDto {
  data: UpdateProtocolToRiskDto[];
  companyId: string;
}

export class FindProtocolToRiskDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
