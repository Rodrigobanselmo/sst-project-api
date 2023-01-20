import { ExamHistoryTypeEnum } from '@prisma/client';

export const employeeExamTypeMap: Record<
  ExamHistoryTypeEnum,
  {
    value: ExamHistoryTypeEnum;
    content: string;
  }
> = {
  [ExamHistoryTypeEnum.ADMI]: {
    value: ExamHistoryTypeEnum.ADMI,
    content: 'Admissional',
  },
  [ExamHistoryTypeEnum.PERI]: {
    value: ExamHistoryTypeEnum.PERI,
    content: 'Periódico',
  },
  [ExamHistoryTypeEnum.RETU]: {
    value: ExamHistoryTypeEnum.RETU,
    content: 'Retorno ao trabalho',
  },
  [ExamHistoryTypeEnum.CHAN]: {
    value: ExamHistoryTypeEnum.CHAN,
    content: 'Mudança de risco',
  },
  [ExamHistoryTypeEnum.DEMI]: {
    value: ExamHistoryTypeEnum.DEMI,
    content: 'Demissional',
  },
  [ExamHistoryTypeEnum.EVAL]: {
    value: ExamHistoryTypeEnum.EVAL,
    content: 'Avaliação médica',
  },
  [ExamHistoryTypeEnum.OFFI]: {
    value: ExamHistoryTypeEnum.OFFI,
    content: 'Mudança de função',
  },
};
