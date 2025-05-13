import { IsInt, IsString } from 'class-validator';

export class DeleteTaskProjectPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
