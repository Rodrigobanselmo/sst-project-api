import { IsString } from 'class-validator';

export class AddTaskPath {
  @IsString()
  companyId!: string;
}
