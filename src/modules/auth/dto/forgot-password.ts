import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  readonly email: string;
}
