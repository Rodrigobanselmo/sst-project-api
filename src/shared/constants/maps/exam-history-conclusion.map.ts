import { ExamHistoryConclusionEnum } from '@prisma/client';

export const employeeExamConclusionTypeMap: Record<
  ExamHistoryConclusionEnum,
  {
    value: ExamHistoryConclusionEnum;
    content: string;
  }
> = {
  [ExamHistoryConclusionEnum.NORMAL]: {
    value: ExamHistoryConclusionEnum.NORMAL,
    content: 'Normal',
  },
  [ExamHistoryConclusionEnum.ALTER]: {
    value: ExamHistoryConclusionEnum.ALTER,
    content: 'Alterado',
  },
  [ExamHistoryConclusionEnum.ALTER_1]: {
    value: ExamHistoryConclusionEnum.ALTER_1,
    content: 'Alterado estável',
  },
  [ExamHistoryConclusionEnum.ALTER_2]: {
    value: ExamHistoryConclusionEnum.ALTER_2,
    content: 'Alterado com agravamento ocupacional',
  },
  [ExamHistoryConclusionEnum.ALTER_3]: {
    value: ExamHistoryConclusionEnum.ALTER_3,
    content: 'Alterado com agravamento não ocupacional',
  },
  [ExamHistoryConclusionEnum.NONE]: {
    value: ExamHistoryConclusionEnum.NONE,
    content: 'Sem conclusão',
  },
};
