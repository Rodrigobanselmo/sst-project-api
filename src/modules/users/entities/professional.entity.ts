import { Professional } from '@prisma/client';

export class ProfessionalEntity implements Professional {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  companyId: string;
  formation: string[];
  certifications: string[];
  crea: string;
  cpf: string;

  constructor(partial: Partial<ProfessionalEntity>) {
    Object.assign(this, partial);
  }
}
