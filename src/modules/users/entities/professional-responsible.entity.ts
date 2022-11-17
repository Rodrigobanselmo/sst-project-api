import { ProfessionalCouncilResponsible, ProfessionalRespTypeEnum } from '@prisma/client';

import { CompanyEntity } from '../../company/entities/company.entity';
import { ProfessionalEntity } from './professional.entity';

export class ProfessionalResponsibleEntity implements ProfessionalCouncilResponsible {
  id: number;
  created_at: Date;
  updated_at: Date;
  startDate: Date;
  professionalCouncilId: number;
  companyId: string;
  professional?: Partial<ProfessionalEntity>;
  company?: CompanyEntity;
  type: ProfessionalRespTypeEnum;

  constructor(partial: Partial<ProfessionalResponsibleEntity & { councils: any }>) {
    Object.assign(this, partial);

    if (this.professional) {
      this.professional = new ProfessionalEntity(this.professional);
    }
  }
}
