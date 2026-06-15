import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CompanyGroupHomeSummaryPath {
  @Type(() => Number)
  @IsInt()
  companyGroupId!: number;
}
