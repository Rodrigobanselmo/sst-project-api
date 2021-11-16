import { IsNumber, IsString } from 'class-validator';

export class UserCompanyDto {
  @IsNumber()
  readonly companyId: number;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}
