import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  readonly password?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isApp?: boolean;
}

export class LoginGoogleUserDto {
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly googleToken?: string;
}
