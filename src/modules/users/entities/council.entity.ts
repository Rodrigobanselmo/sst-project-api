import { ProfessionalEntity } from './professional.entity';
import { ProfessionalCouncil } from '.prisma/client';

export class CouncilEntity implements ProfessionalCouncil {
  id: number;
  councilType: string;
  councilUF: string;
  councilId: string;
  created_at: Date;
  updated_at: Date;
  professionalId: number;
  professional: ProfessionalEntity;

  constructor(partial: Partial<CouncilEntity>) {
    Object.assign(this, partial);
  }
}