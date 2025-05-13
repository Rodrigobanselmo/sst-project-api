import { IsInt, IsString } from 'class-validator';

export class DeleteTaskPath {
  @IsString()
  companyId!: string;

  @IsInt()
  id!: number;
}
