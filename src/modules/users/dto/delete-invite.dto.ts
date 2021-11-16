import { IsEmail, IsString, IsNumber } from 'class-validator';

export class DeleteInviteDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNumber()
  readonly companyId: number;
}
