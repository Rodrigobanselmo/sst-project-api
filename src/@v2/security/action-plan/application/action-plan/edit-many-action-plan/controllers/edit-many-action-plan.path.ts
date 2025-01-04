import { IsString } from 'class-validator';

export class EditActionPlanPath {
  @IsString()
  companyId!: string;
}
