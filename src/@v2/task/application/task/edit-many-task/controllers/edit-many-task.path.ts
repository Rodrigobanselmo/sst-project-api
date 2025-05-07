import { IsInt, IsString } from 'class-validator';

export class EditManyTaskPath {
  @IsString()
  companyId!: string;
}
