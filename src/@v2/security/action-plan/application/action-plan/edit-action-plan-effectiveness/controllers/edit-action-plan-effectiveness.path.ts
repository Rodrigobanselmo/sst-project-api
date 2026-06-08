import { IsString } from 'class-validator';

export class EditActionPlanEffectivenessPath {
  @IsString()
  companyId!: string;
}
