import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6)
  readonly password: string;
}
