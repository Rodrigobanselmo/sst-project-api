import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ProfessionalCouncilEntity } from '../../users/entities/council.entity';
import { ScheduleMedicalVisit, StatusEnum } from '@prisma/client';

import { CompanyEntity } from './company.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';

export class ScheduleMedicalVisitEntity implements ScheduleMedicalVisit {
  id: number;
  updated_at: Date;
  created_at: Date;
  status: StatusEnum;
  doneClinicDate: Date;
  doneLabDate: Date;
  companyId: string;
  userId: number;
  clinicId: string;
  labId: string;
  docId: number;

  company: CompanyEntity;
  user: UserEntity;
  clinic: CompanyEntity;
  lab: CompanyEntity;
  doc: ProfessionalEntity;

  exams: EmployeeExamsHistoryEntity[];

  constructor(partial: Partial<ScheduleMedicalVisitEntity>) {
    Object.assign(this, partial);

    this.company = new CompanyEntity(this.company);
    this.user = new UserEntity(this.user);
    this.clinic = new CompanyEntity(this.clinic);
    this.lab = new CompanyEntity(this.lab);
    this.doc = new ProfessionalEntity(this.doc);
  }
}
