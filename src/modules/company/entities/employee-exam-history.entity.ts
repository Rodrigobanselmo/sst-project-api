import {
  ClinicScheduleTypeEnum,
  EmployeeExamsHistory,
  Exam,
  ExamHistoryConclusionEnum,
  ExamHistoryEvaluationEnum,
  ExamHistoryTypeEnum,
  Hierarchy,
  StatusEnum,
  User,
} from '@prisma/client';
import { ProfessionalEntity } from '../../../modules/users/entities/professional.entity';
import { UserEntity } from '../../../modules/users/entities/user.entity';
import { ExamEntity } from '../../sst/entities/exam.entity';
import { EmployeeESocialEventEntity } from './../../esocial/entities/employeeEsocialEvent.entity';
import { CompanyEntity } from './company.entity';

import dayjs from 'dayjs';
import { EmployeeEntity } from './employee.entity';
import { HierarchyEntity } from './hierarchy.entity';

export class EmployeeExamsHistoryEntity implements EmployeeExamsHistory {
  id: number;
  created_at: Date;
  updated_at: Date;
  expiredDate: Date;
  doneDate: Date;
  validityInMonths: number;
  time: string;
  obs: string;
  fileUrl: string;

  examType: ExamHistoryTypeEnum;
  evaluationType: ExamHistoryEvaluationEnum;
  conclusion: ExamHistoryConclusionEnum;
  status: StatusEnum;
  statusOriginal: StatusEnum;

  doctorId: number;
  doctor: ProfessionalEntity;
  clinicId: string;
  clinic: CompanyEntity;
  examId: number;
  employeeId: number;
  employee: EmployeeEntity;
  exam?: ExamEntity;
  userScheduleId: number;
  userSchedule?: UserEntity;
  userDoneId: number;
  userDone?: UserEntity;
  scheduleMedicalVisitId: number;

  clinicObs: string;
  scheduleType: ClinicScheduleTypeEnum;
  changeHierarchyDate: Date;
  changeHierarchyAnyway: boolean;
  hierarchyId: string;
  subOfficeId: string;
  hierarchy?: HierarchyEntity;
  subOffice?: HierarchyEntity;
  deletedAt: Date;

  isSequential: boolean;
  sendEvent: boolean;
  // isASO: boolean;
  events: EmployeeESocialEventEntity[];
  asoExamId: number;
  asoExam?: EmployeeExamsHistoryEntity;
  complementaryExams?: EmployeeExamsHistoryEntity[];
  price?: number;

  constructor(
    partial: Partial<
      Omit<EmployeeExamsHistoryEntity, 'userSchedule' | 'userDone' | 'exam' | 'hierarchy'> & {
        userSchedule?: User;
        userDone?: User;
        exam?: Exam;
        hierarchy?: Hierarchy;
      }
    >,
  ) {
    Object.assign(this, partial);

    if (this.clinic) {
      this.clinic = new CompanyEntity(this.clinic);
    }

    if (this.employee) {
      this.employee = new EmployeeEntity(this.employee as any);
    }

    if (this.doctor) {
      this.doctor = new ProfessionalEntity(this.doctor);
    }

    // if (this.doctor && this.doctor.professional) {
    //   this.doctor = { ...this.doctor, ...this.doctor.professional };
    // }

    if ([StatusEnum.PENDING, StatusEnum.PROCESSING].includes(this.status as any) && dayjs(this.doneDate).isBefore(dayjs().add(-1, 'day'))) {
      this.statusOriginal = this.status;
      this.status = StatusEnum.EXPIRED;
    }

    if (this.hierarchy) this.hierarchy = new HierarchyEntity(this.hierarchy);
  }
}
