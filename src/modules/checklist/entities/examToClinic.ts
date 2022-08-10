import { CompanyEntity } from './../../company/entities/company.entity';
import {
  ExamToClinic,
  ExamToClinicPricing,
  StatusEnum,
  Exam,
  Prisma,
  ClinicScheduleTypeEnum,
} from '@prisma/client';
import { ExamEntity } from './exam.entity';

export class ExamToClinicEntity implements ExamToClinic {
  id: number;
  examId: number;
  companyId: string;
  dueInDays: number;
  isScheduled: boolean;
  observation: string;
  company: CompanyEntity;
  pricings?: ExamToClinicPricingEntity[];
  scheduleRange: Prisma.JsonValue;
  status: StatusEnum;
  exam?: ExamEntity;
  examMinDuration: string;
  scheduleType: ClinicScheduleTypeEnum;

  constructor(
    partial: Partial<Omit<ExamToClinicEntity, 'exam'> & { exam: Exam }>,
  ) {
    Object.assign(this, partial);
  }
}

export class ExamToClinicPricingEntity implements ExamToClinicPricing {
  id: number;
  examToClinicId: number;
  price: number;
  startDate: Date;
  observation: string;
  examToClinic: ExamToClinicEntity;

  constructor(partial: Partial<ExamToClinicPricingEntity>) {
    Object.assign(this, partial);
  }
}
