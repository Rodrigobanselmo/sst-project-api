import { EmployeeExamsHistoryEntity } from './../../modules/company/entities/employee-exam-history.entity';
import { StatusEnum } from '@prisma/client';
import dayjs from 'dayjs';
import { EmployeeEntity } from './../../modules/company/entities/employee.entity';
import { StatusExamEnum } from '../constants/enum/statusExam.enum';

export const getEmployeeRowStatus = (exam?: EmployeeExamsHistoryEntity, expiredDateExam?: Date): StatusExamEnum | null => {
  const diff = -dayjs().diff(expiredDateExam, 'day');

  // if (!exam) return StatusExamEnum.EXPIRED;

  if (exam?.status == StatusEnum.PROCESSING || exam?.status == StatusEnum.PENDING) {
    if (dayjs().isBefore(exam.doneDate) || dayjs().diff(exam.doneDate, 'day') == 0) {
      if (exam.status == StatusEnum.PROCESSING) return StatusExamEnum.PROCESSING;
      if (exam.status == StatusEnum.PENDING) return StatusExamEnum.PENDING;
    }
  }

  if (!expiredDateExam || diff < 0) return StatusExamEnum.EXPIRED;
  if (diff >= 0 && diff <= 7) return StatusExamEnum.CLOSE_1;
  if (diff > 7 && diff <= 30) return StatusExamEnum.CLOSE_2;
  if (diff >= 30 && diff <= 45) return StatusExamEnum.CLOSE_3;

  return StatusExamEnum.DONE;
};

export const getEmployeeRowExpiredDate = (date?: Date) => {
  if (!date) return 'sem exame';
  if (dayjs().diff(date, 'year') > 100) return 'nenhum';
  return dayjs(date).format('DD[-]MM[-]YYYY');
};
