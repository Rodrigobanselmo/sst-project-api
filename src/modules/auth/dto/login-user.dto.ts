import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginUserDto {
  @ValidateIf((o) => !o.token || o.email)
  @IsString()
  @IsEmail()
  readonly email?: string;

  @ValidateIf((o) => !o.token || o.password)
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  readonly password?: string;

  @ValidateIf((o) => o.token) //oneOf
  @IsString()
  readonly token?: string;
}
