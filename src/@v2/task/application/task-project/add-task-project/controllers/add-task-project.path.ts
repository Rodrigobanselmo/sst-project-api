import { IsString } from 'class-validator';

export class AddTaskProjectPath {
  @IsString()
  companyId!: string;
}
