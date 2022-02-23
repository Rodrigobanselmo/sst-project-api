import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';
import { UserCompanyEditDto } from './update-user-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsEmpty()
  @IsOptional()
  license?: undefined;

  @IsString()
  companyId: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UserCompanyEditDto)
  users: UserCompanyEditDto[];
}
