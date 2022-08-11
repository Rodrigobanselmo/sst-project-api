import { CompanyEntity } from './../../company/entities/company.entity';
import {
  ExamToClinic,
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
  price: number;
  startDate: Date;
  endDate: Date;
  scheduleRange: Prisma.JsonValue;
  status: StatusEnum;
  exam?: ExamEntity;
  examMinDuration: number;
  scheduleType: ClinicScheduleTypeEnum;

  constructor(
    partial: Partial<
      Omit<ExamToClinicEntity, 'exam'> & {
        exam?: Exam;
      }
    >,
  ) {
    Object.assign(this, partial);
  }
}
