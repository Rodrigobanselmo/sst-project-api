import { IsString } from 'class-validator';

export class AbsenteeismPath {
  @IsString()
  companyId!: string;
}
