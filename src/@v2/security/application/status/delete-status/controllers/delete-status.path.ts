import { IsInt, IsString } from 'class-validator';

export class DeleteStatusPath {
  @IsString()
  companyId: string;

  @IsInt()
  id: number;
}
