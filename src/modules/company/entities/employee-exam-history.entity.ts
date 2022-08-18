import { EmployeeExamsHistory } from '@prisma/client';
import { ExamEntity } from 'src/modules/checklist/entities/exam.entity';

import { EmployeeEntity } from './employee.entity';

export class EmployeeExamsHistoryEntity implements EmployeeExamsHistory {
  id: number;
  created_at: Date;
  updated_at: Date;
  doneDate: Date;
  validityInMonths: number;
  time: string;
  examId: number;
  employeeId: number;
  employee: EmployeeEntity;
  exam: ExamEntity;

  constructor(partial: Partial<EmployeeExamsHistoryEntity>) {
    Object.assign(this, partial);
  }
  motive: string;
}
