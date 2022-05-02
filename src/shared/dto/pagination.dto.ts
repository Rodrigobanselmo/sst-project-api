import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  take?: number;

  @IsNumber()
  @IsOptional()
  skip?: number;
}
