import { IsInt, IsString } from 'class-validator';

export class ReadTaskProjectPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
