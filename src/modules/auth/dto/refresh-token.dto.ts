import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  readonly refresh_token: string;

  @IsOptional()
  @IsString()
  readonly companyId?: string;
}
