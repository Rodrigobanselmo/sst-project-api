import { IsInt, IsString } from 'class-validator';

export class EditTaskPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
