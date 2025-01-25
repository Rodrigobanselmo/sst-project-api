import { IsString } from 'class-validator';

export class AddUserPath {
  @IsString()
  companyId!: string;
}
