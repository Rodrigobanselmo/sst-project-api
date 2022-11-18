import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { ApiProperty } from '@nestjs/swagger';

import { CompanyGroup } from '.prisma/client';
import { ProfessionalCouncil } from '@prisma/client';
import { CompanyEntity } from './company.entity';
import { CompanyCertEntity } from '../../../modules/esocial/entities/companyCert.entity';

export class CompanyGroupEntity implements CompanyGroup {
  @ApiProperty({ description: 'The id of the CompanyGroups' })
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

  constructor(partial: Partial<CompanyGroupEntity>) {
    Object.assign(this, partial);

    if (this.companyGroup) {
      this.companyGroup = new CompanyEntity(this.companyGroup);
      this.ambResponsible = this.companyGroup?.ambResponsible;
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
