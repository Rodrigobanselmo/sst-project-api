import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertAccessGroupDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsString({ each: true })
  @IsOptional()
  roles: string[];

  @IsOptional()
  @IsString({ each: true })
  permissions: string[];
}

export class FindAccessGroupDto extends PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  search: string[];

  @IsString({ each: true })
  @IsOptional()
  roles: string[];

  @IsOptional()
  @IsString({ each: true })
  permissions: string[];
}
