import { StatusEnum } from '@prisma/client';
import dayjs from 'dayjs';
import { EmployeeEntity } from './../../modules/company/entities/employee.entity';
import { StatusExamEnum } from '../constants/enum/statusExam.enum';

export const getEmployeeRowStatus = (data?: EmployeeEntity): StatusExamEnum | null => {
  if (!data?.examsHistory) return null;

  const exam = data.examsHistory?.[0];
  const diff = -dayjs().diff(data?.expiredDateExam, 'day');

  if (!exam) return StatusExamEnum.EXPIRED;

  if (exam?.status == StatusEnum.PROCESSING || exam?.status == StatusEnum.PENDING) {
    if (dayjs().isBefore(exam.doneDate) || dayjs().diff(exam.doneDate, 'day') == 0) {
      if (exam.status == StatusEnum.PROCESSING) return StatusExamEnum.PROCESSING;
      if (exam.status == StatusEnum.PENDING) return StatusExamEnum.PENDING;
    }
  }

  if (!data?.expiredDateExam || diff < 0) return StatusExamEnum.EXPIRED;
  if (diff >= 0 && diff <= 7) return StatusExamEnum.CLOSE_1;
  if (diff > 7 && diff <= 30) return StatusExamEnum.CLOSE_2;
  if (diff >= 30 && diff <= 45) return StatusExamEnum.CLOSE_3;

  return StatusExamEnum.DONE;
};
