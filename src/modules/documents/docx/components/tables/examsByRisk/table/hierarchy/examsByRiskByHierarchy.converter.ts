import clone from 'clone';
import { palette } from '../../../../../../../../shared/constants/palette';
import { getIsTodosRisk } from '../../../../../../../../shared/utils/getIsTodosRisk';
import { sortString } from '../../../../../../../../shared/utils/sorts/string.sort';
import { IExamOriginData, IExamOrigins } from '../../../../../../../sst/entities/exam.entity';
import { filterOriginsByHierarchy } from '../../../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { HierarchyMapData, IHierarchyData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';
import { HierarchyPlanMap } from '../../../hierarchyHomoOrg/hierarchyHomoOrg.constant';
import { bodyTableProps } from '../../elements/body';
import { getIsAll, getX, removeExamsDuplicated } from '../exam-utils';
import { ExamByHierarchyColumnEnum } from './examsByRiskByHierarchy.constant';
import { VerticalAlign } from 'docx';


// function calculateRowSpanFunc({ index: i, rows, indexCellRange, isFirst = true, startIndex }: { rows: bodyTableProps[][]; index: number; indexCellRange: number[]; isFirst?: boolean, startIndex: number }) {
//   const [indexCell, ...restIndexCellRange] = indexCellRange
//   const initIndex = i
//   const indexNextRow = i + 1
//   const currentRow = rows[i]?.[indexCell];
//   const nextRow = rows[indexNextRow]?.[indexCell];

//   let index = i
//   let count = 0;

//   if (nextRow?.text && currentRow?.text === nextRow.text) {
//     count++;

//     const calc = calculateRowSpanFunc({ index: indexNextRow, rows, indexCellRange, isFirst: false, startIndex });

//     rows[indexNextRow].splice(indexCell, 1);

//     index = calc.index;
//     count += calc.count;
//   } else if (startIndex !== index) {
//     calculateRowSpan(rows, restIndexCellRange)
//   }

//   if (isFirst) (rows as any)[initIndex][indexCell].rowSpan = count + 1;


//   return { count, index };
// }

// function calculateRowSpan(rows: bodyTableProps[][], indexCellRange: number[]) {
//   for (let i = 0; i < rows.length;) {

//     const calc = calculateRowSpanFunc({ index: i, rows, indexCellRange, startIndex: i });
//     i = calc.index;

//     i++
//   }

// }

// function rowSortColumns(arr1: bodyTableProps[], arr2: bodyTableProps[], numColumns: number) {
//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i].text < arr2[i].text) {
//       return -1;
//     } else if (arr1[i].text > arr2[i].text) {
//       return 1;
//     }
//   }
//   return 0;
// }

function customSort(a: bodyTableProps[], b: bodyTableProps[], columnIndex: number): number {
  const nameA = a[columnIndex]?.text || '';
  const nameB = b[columnIndex]?.text || '';

  const isNumberA = !isNaN(Number(nameA));
  const isNumberB = !isNaN(Number(nameB));

  if (isNumberA && isNumberB) {
    return Number(nameA) - Number(nameB);
  }

  return nameA.localeCompare(nameB);
}

function sortRowsByColumns(data: bodyTableProps[][]): bodyTableProps[][] {
  return data.sort((a, b) => {
    let columnIndex = 0;
    let comparisonResult = customSort(a, b, columnIndex);

    while (comparisonResult === 0) {
      columnIndex++;
      comparisonResult = customSort(a, b, columnIndex);
    }

    return comparisonResult;
  });
}


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

  const data = Array.from(hierarchyData.entries()).map(([id, hierarchy]) => ({ id, ...hierarchy }))

  data
    .forEach(({ id, ...hierarchy }) => {
      //* [if want to have rowSpan] let lastRiskId = '';
      hierarchy.org

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

        cells.unshift(...clone(hierarchyTypeArray))

        hierarchy.org.forEach((org) => {
          cells[HierarchyPlanMap[org.typeEnum].position].text = org?.name || ''
        })

        rows.push(cells);
      })
    });


  const sortedRows = sortRowsByColumns(rows)

  const reapetedCount = [];
  const referenceIndexes = [];
  const cellLength = hierarchyTypeArray.length + 2

  sortedRows.forEach((row, indexRow) => {
    const isLastRow = indexRow === sortedRows.length - 1
    row.slice(0, cellLength).forEach((cell, indexCell) => {
      const referenceIndex = referenceIndexes[indexCell] || 0
      if (referenceIndex === indexRow) return

      const count = reapetedCount[indexCell] || 1
      const referenceCell = sortedRows[referenceIndex]?.[indexCell]

      const sameText = cell.text === referenceCell?.text
      if (sameText) {
        reapetedCount[indexCell] = count + 1
        sortedRows[indexRow][indexCell].text = '--deleted--'
      }

      if (!sameText || isLastRow) {
        Array.from({ length: cellLength }).forEach((_, allIndexes) => {
          if (indexCell > allIndexes) return

          const allReferenceIndex = referenceIndexes[allIndexes] || 0
          const allReapetedCount = reapetedCount[allIndexes] || 1

          sortedRows[allReferenceIndex][allIndexes].rowSpan = allReapetedCount
          sortedRows[allReferenceIndex][allIndexes].verticalAlign = VerticalAlign.TOP

          reapetedCount[allIndexes] = 1
          referenceIndexes[allIndexes] = indexRow
        })
      }

    })
  })

  return sortedRows.map((row) => row.filter((cell) => cell.text !== '--deleted--'));
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


