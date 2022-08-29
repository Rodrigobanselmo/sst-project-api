import {
  EmployeeExamsHistory,
  ExamHistoryEvaluationEnum,
  ExamHistoryConclusionEnum,
  ExamHistoryTypeEnum,
  StatusEnum,
} from '@prisma/client';
import { UserEntity } from '../../../modules/users/entities/user.entity';
import { ExamEntity } from '../../../modules/checklist/entities/exam.entity';
import { ProfessionalEntity } from '../../../modules/users/entities/professional.entity';
import { CompanyEntity } from './company.entity';

import { EmployeeEntity } from './employee.entity';

export class EmployeeExamsHistoryEntity implements EmployeeExamsHistory {
  id: number;
  created_at: Date;
  updated_at: Date;
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
  exam: ExamEntity;
  userScheduleId: number;
  userSchedule: UserEntity;
  userDoneId: number;
  userDone: UserEntity;

  validation: string;

  constructor(partial: Partial<EmployeeExamsHistoryEntity>) {
    Object.assign(this, partial);
  }
}
