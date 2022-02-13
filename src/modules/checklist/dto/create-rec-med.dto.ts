import { IsString } from 'class-validator';

export class CreateRecMedDto {
  @IsString()
  recName: string;

  @IsString()
  medName: string;

  @IsString()
  companyId: string;
}
