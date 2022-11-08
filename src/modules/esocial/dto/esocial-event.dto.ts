import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

export class FindESocialEventDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  companyId: string;
}
