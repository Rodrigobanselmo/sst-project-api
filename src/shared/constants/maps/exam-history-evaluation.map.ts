import { ReportColorEnum } from './../../../modules/files/factories/report/types/IReportFactory.types';
import { ExamHistoryEvaluationEnum } from '@prisma/client';

export const employeeExamEvaluationTypeMap: Record<
  ExamHistoryEvaluationEnum,
  {
    value: ExamHistoryEvaluationEnum;
    content: string;
    color?: ReportColorEnum;
  }
> = {
  [ExamHistoryEvaluationEnum.APTO]: {
    value: ExamHistoryEvaluationEnum.APTO,
    content: 'Apto',
    color: ReportColorEnum.GREEN,
  },
  [ExamHistoryEvaluationEnum.INAPT]: {
    value: ExamHistoryEvaluationEnum.INAPT,
    content: 'Inapto',
    color: ReportColorEnum.RED,
  },
  [ExamHistoryEvaluationEnum.INCONCLUSIVE]: {
    value: ExamHistoryEvaluationEnum.INCONCLUSIVE,
    content: 'Não conclusivo',
    color: ReportColorEnum.YELLOW,
  },
  [ExamHistoryEvaluationEnum.NONE]: {
    value: ExamHistoryEvaluationEnum.NONE,
    content: 'Sem avaliação',
  },
};
