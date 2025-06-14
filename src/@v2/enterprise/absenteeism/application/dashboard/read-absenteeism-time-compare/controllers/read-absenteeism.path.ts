import { IsString } from 'class-validator';

export class ReadAbsenteeismPath {
  @IsString()
  companyId!: string;
}
