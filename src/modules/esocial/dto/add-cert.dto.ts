import { IsOptional, IsString } from 'class-validator';

export class AddCertDto {
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  companyId: string;
}

export class UpsertAddCertDto {
  certificate: string;
  key: string;
  notAfter: Date;
  notBefore: Date;
  companyId: string;
}
