import { ProfessionalEntity } from './../../users/entities/professional.entity';

import { CompanyGroup } from '.prisma/client';
import { ProfessionalCouncil } from '@prisma/client';
import { CompanyEntity } from './company.entity';
import { CompanyCertEntity } from '../../../modules/esocial/entities/companyCert.entity';
import { CompanyOSEntity } from './os.entity';

export class CompanyGroupEntity implements CompanyGroup {
  id: number;
  name: string;
  description: string;
  esocialSend: boolean;
  created_at: Date;
  updated_at: Date;
  companyId: string;
  numAsos: number;
  blockResignationExam: boolean;
  esocialStart: Date;
  doctorResponsibleId: number;
  tecResponsibleId: number;
  doctorResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;
  tecResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;
  ambResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;
  company?: Partial<CompanyEntity>;
  cert?: CompanyCertEntity;
  companyGroup?: Partial<CompanyEntity>;
  os?: CompanyOSEntity;

  constructor(partial: Partial<CompanyGroupEntity>) {
    Object.assign(this, partial);

    if (this.companyGroup) {
      this.companyGroup = new CompanyEntity(this.companyGroup);
      this.ambResponsible = this.companyGroup?.ambResponsible;
      this.cert = this.companyGroup?.cert;
      this.os = this.companyGroup?.os;
    }

    if (this.company) {
      this.cert = this.company?.cert;
    }

    if (this.doctorResponsible) {
      this.doctorResponsible = new ProfessionalEntity(this.doctorResponsible);
    }

    if (this.tecResponsible) {
      this.tecResponsible = new ProfessionalEntity(this.tecResponsible);
    }
  }
}
