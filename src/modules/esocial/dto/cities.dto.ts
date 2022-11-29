import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class FindCitiesDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
