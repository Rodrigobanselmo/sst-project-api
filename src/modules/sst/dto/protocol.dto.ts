import { IsOptional, IsString } from 'class-validator';

export class CreateProtocolDto {
  @IsString()
  name?: string;

  @IsString()
  companyId: string;
}

export class UpdateProtocolDto {
  // @IsString()
  // @IsOptional()
  // id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  companyId: string;
}
