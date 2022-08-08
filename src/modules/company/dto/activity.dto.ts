import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ActivityDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  @IsOptional()
  riskDegree: number;
}

export class FindActivityDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
