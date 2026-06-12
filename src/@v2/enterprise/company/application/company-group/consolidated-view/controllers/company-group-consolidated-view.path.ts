import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CompanyGroupConsolidatedViewPath {
  @Type(() => Number)
  @IsInt()
  companyGroupId!: number;
}
