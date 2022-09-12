import {
  EmployeeExamsHistory,
  ExamHistoryEvaluationEnum,
  ExamHistoryConclusionEnum,
  ExamHistoryTypeEnum,
  StatusEnum,
  User,
  Exam,
  ClinicScheduleTypeEnum,
  Hierarchy,
} from '@prisma/client';
import { UserEntity } from '../../../modules/users/entities/user.entity';
import { ExamEntity } from '../../../modules/checklist/entities/exam.entity';
import { ProfessionalEntity } from '../../../modules/users/entities/professional.entity';
import { CompanyEntity } from './company.entity';

import { EmployeeEntity } from './employee.entity';
import { HierarchyEntity } from './hierarchy.entity';
import dayjs from 'dayjs';

export class EmployeeExamsHistoryEntity implements EmployeeExamsHistory {
  id: number;
  created_at: Date;
  updated_at: Date;
  expiredDate: Date;
  doneDate: Date;
  validityInMonths: number;
  time: string;
  obs: string;

  examType: ExamHistoryTypeEnum;
  evaluationType: ExamHistoryEvaluationEnum;
  conclusion: ExamHistoryConclusionEnum;
  status: StatusEnum;

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

  clinicObs: string;
  scheduleType: ClinicScheduleTypeEnum;
  changeHierarchyDate: Date;
  changeHierarchyAnyway: boolean;
  isScheduleMain: boolean;
  hierarchyId: string;
  hierarchy?: HierarchyEntity;

  constructor(
    partial: Partial<
      Omit<
        EmployeeExamsHistoryEntity,
        'userSchedule' | 'userDone' | 'exam' | 'hierarchy'
      > & {
        userSchedule?: User;
        userDone?: User;
        exam?: Exam;
        hierarchy?: Hierarchy;
      }
    >,
  ) {
    Object.assign(this, partial);

    //! testar
    if (
      [StatusEnum.PENDING, StatusEnum.PROCESSING].includes(
        this.status as any,
      ) &&
      dayjs(this.doneDate).isBefore(dayjs())
    )
      this.status = StatusEnum.EXPIRED;

    if (this.hierarchy) this.hierarchy = new HierarchyEntity(this.hierarchy);
  }
}
