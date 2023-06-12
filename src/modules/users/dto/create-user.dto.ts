import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  password: string;

  @IsString()
  @IsOptional()
  readonly googleToken: string;

  @IsString()
  @IsOptional()
  readonly photoUrl: string;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly token: string;
}
