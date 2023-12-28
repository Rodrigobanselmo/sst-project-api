import { getIsTodosRisk } from '../../../../../../../../shared/utils/getIsTodosRisk';
import { sortString } from '../../../../../../../../shared/utils/sorts/string.sort';
import { IHierarchyMap, IHomoGroupMap, IRiskMap } from '../../../../../converter/hierarchy.converter';
import { IExamOriginData, IExamOrigins } from '../../../../../../../sst/entities/exam.entity';
import { bodyTableProps } from '../../elements/body';
import { ExamByGroupColumnEnum } from '../../examsByRisk.constant';
import { filterOriginsByHierarchy } from '../../../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { getHomoGroupName } from '../../../apprByGroup/appr-group.section';
import { palette } from '../../../../../../../../shared/constants/palette';

export const examsByGroupConverter = (homoMap: IHomoGroupMap, exams: IExamOrigins[], hierarchyTree: IHierarchyMap) => {
  const rows: bodyTableProps[][] = [];


  const gseExamsMap = examsByGroupGetData(homoMap, exams)

  const getIsAll = (riskId: string, riskName?: string) => {
    const isAll = getIsTodosRisk({ riskId }) || !riskName
    return isAll
  }

  Object.values(homoMap)
    .sort((a, b) => sortString(a, b, 'name'))
    .forEach((gse) => {
      const { nameOrigin, typeOrigin } = getHomoGroupName(gse, hierarchyTree)
      const isTypeGSE = 'GSE' === typeOrigin;
      let lastRiskId = '';

      const examArray = Object.values(gseExamsMap[gse.id]).flat();
      examArray.sort((a, b) => sortString(
        (getIsTodosRisk({ riskId: a.origin.risk?.id }) ? '' : a.origin.risk?.name) || '',
        (getIsTodosRisk({ riskId: b.origin.risk?.id }) ? '' : b.origin.risk?.name) || '',
      )).forEach((examOrigin, examIndex) => {
        const cells: bodyTableProps[] = [];
        const riskId = examOrigin.origin?.risk?.id;

        if (examIndex == 0) {
          const rowSpan = examArray.length;
          cells[ExamByGroupColumnEnum.GSE] = { text: nameOrigin + (isTypeGSE ? '' : `\n${typeOrigin}`), size: 4, rowSpan };
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


const examsByGroupGetData = (homoMap: IHomoGroupMap, exams: IExamOrigins[]) => {
  const gseExamsMap: Record<string, Record<string, { name: string; origin?: IExamOriginData }[]>> = {}


  Object.values(homoMap).forEach((gse) => {
    if (!gseExamsMap[gse.id]) gseExamsMap[gse.id] = {}

    gse.hierarchies.forEach((hierarchy) => {
      const origins = filterOriginsByHierarchy(exams, gse.companyId, hierarchy.id)

      origins.forEach((originInfo) => {
        if (!gseExamsMap[gse.id][originInfo.exam.id]) gseExamsMap[gse.id][originInfo.exam.id] = []

        originInfo.origins.forEach((origin) => {
          gseExamsMap[gse.id][originInfo.exam.id].push({ name: originInfo.exam.name, origin })
        });
      })
    })
  })

  return gseExamsMap;
};


