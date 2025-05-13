import { IsInt, IsString } from 'class-validator';

export class EditTaskProjectPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
