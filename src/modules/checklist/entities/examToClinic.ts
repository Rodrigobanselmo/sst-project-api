import { CompanyEntity } from './../../company/entities/company.entity';
import {
  ExamToClinic,
  ExamToClinicSchedule,
  ExamToClinicPricing,
  StatusEnum,
  Exam,
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
  schedules?: ExamToClinicScheduleEntity[];
  status: StatusEnum;
  exam?: ExamEntity;

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

export class ExamToClinicScheduleEntity implements ExamToClinicSchedule {
  id: number;
  examToClinicId: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  observation: string;
  examToClinic: ExamToClinicEntity;

  constructor(partial: Partial<ExamToClinicScheduleEntity>) {
    Object.assign(this, partial);
  }
}
