import { TextDirection } from 'docx';
import { headerTableProps } from '../../elements/header';

export enum ExamByGroupColumnEnum {
  GSE,
  RISKS,
  EXAMS,
  PERIODICIDADE,
  PRE_ADMISSION,
  RETURN_TO_WORK,
  CHANGE_RISK,
  DEMISSIONAL,
}

const NewExamsByGroupHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[ExamByGroupColumnEnum.GSE] = { text: 'GSE', size: 3, };
  header[ExamByGroupColumnEnum.RISKS] = { text: 'Riscos', size: 5 };
  header[ExamByGroupColumnEnum.EXAMS] = { text: 'Exames', size: 5 };
  header[ExamByGroupColumnEnum.PERIODICIDADE] = {
    text: 'Periodicidade (meses)', size: 2,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByGroupColumnEnum.PRE_ADMISSION] = {
    text: 'Pré-Adminissional', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByGroupColumnEnum.RETURN_TO_WORK] = {
    text: 'Retorno ao Trabalho', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByGroupColumnEnum.CHANGE_RISK] = {
    text: 'Mudança de Risco', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByGroupColumnEnum.DEMISSIONAL] = {
    text: 'Demissional', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };

  return header;
};

export const examsByGroupHeader = NewExamsByGroupHeader();
