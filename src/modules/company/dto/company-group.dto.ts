import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpsertCompanyGroupDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @ValidateIf((o) => !o.id)
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @ValidateIf((o) => !o.id)
  @IsString({ each: true })
  companiesIds: string[];
}

export class FindCompanyGroupDto extends PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  search: string[];

  @IsString()
  @IsOptional()
  name: string;
}
