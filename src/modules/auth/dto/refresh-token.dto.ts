import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class RefreshTokenDto {
  @IsString()
  readonly refresh_token: string;

  @IsOptional()
  @IsString()
  readonly companyId?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isApp?: boolean;
}
