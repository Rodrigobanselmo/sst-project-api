import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';

export class CidDto {
  @IsString()
  cid: string;

  @IsString()
  description: string;
}

export class FindCidDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  cid?: string;
}
