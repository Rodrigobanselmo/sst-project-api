import { CompanyEntity } from './../../../../../../../company/entities/company.entity';
import { getIsTodosRisk } from '../../../../../../../../shared/utils/getIsTodosRisk';
import { sortString } from '../../../../../../../../shared/utils/sorts/string.sort';
import { HierarchyMapData, IHierarchyData, IHierarchyMap, IHomoGroupMap, IRiskMap } from '../../../../../converter/hierarchy.converter';
import { IExamOriginData, IExamOrigins } from '../../../../../../../sst/entities/exam.entity';
import { bodyTableProps } from '../../elements/body';
import { ExamByGroupColumnEnum } from '../../examsByRisk.constant';
import { filterOriginsByHierarchy } from '../../../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { getHomoGroupName } from '../../../apprByGroup/appr-group.section';
import { palette } from '../../../../../../../../shared/constants/palette';

export const examsByHierarchyConverter = (hierarchyData: IHierarchyData, exams: IExamOrigins[], companyId: string, hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];


  const hierarchyExamsMap = examsByGroupGetData(hierarchyData, exams, companyId)

  const getIsAll = (riskId: string, riskName?: string) => {
    const isAll = getIsTodosRisk({ riskId }) || !riskName
    return isAll
  }

  Array.from(hierarchyData.entries())
    .sort((a, b) => sortString(a, b, 'name'))
    .forEach(([id, hierarchy]) => {
      let lastRiskId = '';

      const examArray = Object.values(hierarchyExamsMap[id]).flat();
      examArray.sort((a, b) => sortString(
        (getIsTodosRisk({ riskId: a.origin.risk?.id }) ? '' : a.origin.risk?.name) || '',
        (getIsTodosRisk({ riskId: b.origin.risk?.id }) ? '' : b.origin.risk?.name) || '',
      )).forEach((examOrigin, examIndex) => {
        const cells: bodyTableProps[] = [];
        const riskId = examOrigin.origin?.risk?.id;

        if (examIndex == 0) {
          const rowSpan = examArray.length;
          cells[ExamByGroupColumnEnum.GSE] = { text: hierarchyTree[id]?.name || '', size: 4, rowSpan };
        }

        const isAll = getIsAll(riskId, examOrigin.origin?.risk?.name)
        const refId = (isAll ? 'all' : riskId)

        if (lastRiskId != refId) {
          lastRiskId = refId || '';
          const text = isAll ? 'não vinculado a risco específico' : examOrigin.origin?.risk?.name || '';

          const sameRiskExams = examArray.filter((exam) => isAll ? getIsAll(exam.origin?.risk?.id, exam.origin?.risk?.name) : exam.origin?.risk?.id === riskId);
          const rowSpan = sameRiskExams.length
          cells[ExamByGroupColumnEnum.RISKS] = { text, size: 5, rowSpan, ...(isAll && { color: palette.text.simple.string }) };
        }


        cells[ExamByGroupColumnEnum.EXAMS] = { text: examOrigin.name, size: 5 };
        cells[ExamByGroupColumnEnum.PERIODICIDADE] = { text: examOrigin.origin.isPeriodic ? String(examOrigin.origin.validityInMonths || '-') : '', size: 1 };
        cells[ExamByGroupColumnEnum.PRE_ADMISSION] = { ...getX(examOrigin.origin.isAdmission), size: 1 };
        cells[ExamByGroupColumnEnum.RETURN_TO_WORK] = { ...getX(examOrigin.origin.isReturn), size: 1 };
        cells[ExamByGroupColumnEnum.CHANGE_RISK] = { ...getX(examOrigin.origin.isChange), size: 1 };
        cells[ExamByGroupColumnEnum.DEMISSIONAL] = { ...getX(examOrigin.origin.isDismissal), size: 1 };

        rows.push(cells);
      })
    });

  return rows;
};
const getX = (isSelected: boolean) => {
  return {
    text: isSelected ? 'X' : '',
    size: 1,
    fontSize: 15
  }
}


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

  return hierarchyExamsMap;
};


