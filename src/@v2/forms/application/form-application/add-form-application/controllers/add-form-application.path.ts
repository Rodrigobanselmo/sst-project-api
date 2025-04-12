import { IsString } from 'class-validator';

export class AddFormApplicationPath {
  @IsString()
  companyId!: string;
}
