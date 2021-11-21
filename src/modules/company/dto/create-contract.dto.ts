import { IsEmpty, IsOptional } from 'class-validator';
// import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { CreateCompanyDto } from './create-company.dto';
// import { LicenseDto } from './license.dto';

export class CreateContractDto extends CreateCompanyDto {
  @IsEmpty()
  @IsOptional()
  readonly license?: undefined;

  @IsString()
  companyId: string;
}
