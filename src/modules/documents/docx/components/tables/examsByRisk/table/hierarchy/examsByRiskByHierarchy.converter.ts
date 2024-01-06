import { palette } from '../../../../../../../../shared/constants/palette';
import { getIsTodosRisk } from '../../../../../../../../shared/utils/getIsTodosRisk';
import { sortString } from '../../../../../../../../shared/utils/sorts/string.sort';
import { IExamOriginData, IExamOrigins } from '../../../../../../../sst/entities/exam.entity';
import { filterOriginsByHierarchy } from '../../../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { IHierarchyData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';
import { HierarchyPlanMap } from '../../../hierarchyHomoOrg/hierarchyHomoOrg.constant';
import { bodyTableProps } from '../../elements/body';
import { getIsAll, getX, removeExamsDuplicated } from '../exam-utils';
import { ExamByHierarchyColumnEnum } from './examsByRiskByHierarchy.constant';

export const examsByHierarchyConverter = (hierarchyData: IHierarchyData, exams: IExamOrigins[], companyId: string, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];
  const hierarchyType: Record<string, string> = {}
  const hierarchyTypeArray: bodyTableProps[] = []

  Array.from(hierarchyData.entries()).forEach(([, hierarchy]) => {
    hierarchy.org.forEach((org) => {
      if (!hierarchyType[org.typeEnum]) {
        hierarchyType[org.typeEnum] = org.typeEnum
        hierarchyTypeArray[HierarchyPlanMap[org.typeEnum].position] = { text: '', size: 3, fontSize: 8 };
      }
    })
  })



  const hierarchyExamsMap = examsByGroupGetData(hierarchyData, exams, companyId)

  Array.from(hierarchyData.entries())
    .sort((a, b) => sortString(a, b, 'name'))
    .forEach(([id, hierarchy]) => {
      //* [if want to have rowSpan] let lastRiskId = '';

      const examArray = Object.values(hierarchyExamsMap[id]).flat();
      examArray.sort((a, b) => sortString(
        (getIsTodosRisk({ riskId: a.origin.risk?.id }) ? '' : a.origin.risk?.name) || '',
        (getIsTodosRisk({ riskId: b.origin.risk?.id }) ? '' : b.origin.risk?.name) || '',
      )).forEach((examOrigin, examIndex) => {
        const cells: bodyTableProps[] = [];
        const riskId = examOrigin.origin?.risk?.id;

        //* [if want to have rowSpan] if (examIndex == 0) {
        //* [if want to have rowSpan] const rowSpan = examArray.length;
        const rowSpan = undefined


        //* [if want]cells[ExamByHierarchyColumnEnum.HIERARCHY] = { text: hierarchyTree[id]?.name || '', size: 4, rowSpan };
        //* [if want to have rowSpan] }

        const isAll = getIsAll(riskId, examOrigin.origin?.risk?.name)
        //* [if want to have rowSpan] const refId = (isAll ? 'all' : riskId)

        //* [if want to have rowSpan] if (lastRiskId != refId) {
        //* [if want to have rowSpan] lastRiskId = refId || '';
        const text = isAll ? 'não vinculado a risco específico' : examOrigin.origin?.risk?.name || '';

        //* [if want to have rowSpan] const sameRiskExams = examArray.filter((exam) => isAll ? getIsAll(exam.origin?.risk?.id, exam.origin?.risk?.name) : exam.origin?.risk?.id === riskId);
        //* [if want to have rowSpan] const rowSpan = sameRiskExams.length
        //* [if want to have rowSpan] const rowSpan = undefined
        cells[ExamByHierarchyColumnEnum.RISKS] = { text, size: 5, rowSpan, ...(isAll && { color: palette.text.simple.string }), fontSize: 10 };
        //* [if want to have rowSpan] }


        cells[ExamByHierarchyColumnEnum.EXAMS] = { text: examOrigin.name, size: 5, fontSize: 10 };
        cells[ExamByHierarchyColumnEnum.PERIODICIDADE] = { text: examOrigin.origin.isPeriodic ? String(examOrigin.origin.validityInMonths || '-') : '', size: 1 };
        cells[ExamByHierarchyColumnEnum.PRE_ADMISSION] = { ...getX(examOrigin.origin.isAdmission), size: 1 };
        cells[ExamByHierarchyColumnEnum.RETURN_TO_WORK] = { ...getX(examOrigin.origin.isReturn), size: 1 };
        cells[ExamByHierarchyColumnEnum.CHANGE_RISK] = { ...getX(examOrigin.origin.isChange), size: 1 };
        cells[ExamByHierarchyColumnEnum.DEMISSIONAL] = { ...getX(examOrigin.origin.isDismissal), size: 1 };



        cells.unshift(...hierarchyTypeArray)

        hierarchy.org.forEach((org) => {
          cells[HierarchyPlanMap[org.typeEnum].position].text = org?.name || ''
        })

        rows.push(cells);
      })
    });

  return rows;
};

const examsByGroupGetData = (hierarchyData: IHierarchyData, exams: IExamOrigins[], companyId: string) => {
  const hierarchyExamsMap: Record<string, Record<string, { name: string; origin?: IExamOriginData }[]>> = {}

  hierarchyData.forEach((hierarchy, id) => {
    if (!hierarchyExamsMap[id]) hierarchyExamsMap[id] = {}

    hierarchy.org.map((org) => ({ id: org.id })).forEach((hierarchy) => {
      const origins = filterOriginsByHierarchy(exams, companyId, hierarchy.id)

      origins.forEach((originInfo) => {
        if (!hierarchyExamsMap[id][originInfo.exam.id]) hierarchyExamsMap[id][originInfo.exam.id] = []

        originInfo.origins.forEach((origin) => {
          hierarchyExamsMap[id][originInfo.exam.id].push({ name: originInfo.exam.name, origin })
        });
      })
    })
  })

  return removeExamsDuplicated(hierarchyExamsMap);
};


