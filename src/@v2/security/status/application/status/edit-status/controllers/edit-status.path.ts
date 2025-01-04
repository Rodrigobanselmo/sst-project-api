import { IsInt, IsString } from 'class-validator';

export class EditStatusPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
