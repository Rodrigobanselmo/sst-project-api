import { IsEmail, IsString } from 'class-validator';

export class DeleteInviteDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly companyId: string;
}
