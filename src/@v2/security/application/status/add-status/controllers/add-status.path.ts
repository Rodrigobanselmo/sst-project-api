import { IsString } from 'class-validator';

export class AddStatusPath {
  @IsString()
  companyId: string;
}
