import { IHierarchyData } from './../../../../../converter/hierarchy.converter';
import { TextDirection } from 'docx';
import { headerTableProps } from '../../elements/header';
import { HierarchyPlanMap } from '../../../hierarchyHomoOrg/hierarchyHomoOrg.constant';

export enum ExamByHierarchyColumnEnum {
  RISKS,
  EXAMS,
  PERIODICIDADE,
  PRE_ADMISSION,
  RETURN_TO_WORK,
  CHANGE_RISK,
  DEMISSIONAL,
}

export const NewExamsByHierarchyHeader = (hierarchyData: IHierarchyData, options: { withGroup?: boolean }): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[ExamByHierarchyColumnEnum.RISKS] = { text: 'Riscos', size: 5 };
  header[ExamByHierarchyColumnEnum.EXAMS] = { text: 'Exames', size: 5 };
  header[ExamByHierarchyColumnEnum.PERIODICIDADE] = {
    text: 'Periodicidade (meses)', size: 2,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByHierarchyColumnEnum.PRE_ADMISSION] = {
    text: 'Pré-Adminissional', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByHierarchyColumnEnum.RETURN_TO_WORK] = {
    text: 'Retorno ao Trabalho', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByHierarchyColumnEnum.CHANGE_RISK] = {
    text: 'Mudança de Risco', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };
  header[ExamByHierarchyColumnEnum.DEMISSIONAL] = {
    text: 'Demissional', size: 1,
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
  };


  const hierarchyType: Record<string, string> = {}
  const hierarchyTypeArray: headerTableProps[] = []

  Array.from(hierarchyData.entries()).forEach(([, hierarchy]) => {
    hierarchy.org.forEach((org) => {
      if (!hierarchyType[org.typeEnum]) {
        hierarchyType[org.typeEnum] = org.typeEnum
        hierarchyTypeArray[HierarchyPlanMap[org.typeEnum].position] = { text: HierarchyPlanMap[org.typeEnum].text, size: 3 };
      }
    })
  })

  if (options.withGroup) hierarchyTypeArray.push({ text: 'GSE', size: 3 })

  header.unshift(...hierarchyTypeArray.filter(Boolean));

  return header;
};
