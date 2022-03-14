import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { CreateCompanyDto } from './create-company.dto';
import { UpdateEmployeeDto } from './employee.dto';
import { UserCompanyEditDto } from './update-user-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  companyId: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UserCompanyEditDto)
  users: UserCompanyEditDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateEmployeeDto)
  employees: UpdateEmployeeDto[];
}
