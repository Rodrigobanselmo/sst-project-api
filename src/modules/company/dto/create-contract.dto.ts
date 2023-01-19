import { IsEmpty, IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

import { CreateCompanyDto } from './company.dto';

export class CreateContractDto extends CreateCompanyDto {
  @IsEmpty()
  @IsOptional()
  readonly license?: undefined;

  @IsString()
  companyId: string;
}
