import { IsEmail, IsString } from 'class-validator';

export class PayloadTokenDto {
  @IsString()
  readonly sub: number;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}
