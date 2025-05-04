import { IsInt, IsString } from 'class-validator';

export class ReadTaskPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
