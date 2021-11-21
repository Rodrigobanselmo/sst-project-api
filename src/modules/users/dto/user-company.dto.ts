import { IsString } from 'class-validator';

export class UserCompanyDto {
  @IsString()
  readonly companyId: string;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}
