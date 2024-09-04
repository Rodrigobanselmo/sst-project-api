import clone from 'clone';
import { VerticalAlign } from 'docx';
import { palette } from '../../../../../constants/palette';
import { removeDuplicate } from '../../../../../../../../shared/utils/removeDuplicate';
import { sortNumber } from '../../../../../../../../shared/utils/sorts/number.sort';
import { IExamOriginData, IExamOrigins } from '../../../../../../../sst/entities/exam.entity';
import { filterOriginsByHierarchy } from '../../../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { IHierarchyData, IHierarchyMap, IHomoGroupMap } from '../../../../../converter/hierarchy.converter';
import { HierarchyPlanMap } from '../../../hierarchyHomoOrg/hierarchyHomoOrg.constant';
import { bodyTableProps } from '../../elements/body';
import { getIsAll, getX, removeExamsDuplicated } from '../exam-utils';
import { ExamByHierarchyColumnEnum } from './examsByRiskByHierarchy.constant';
import { HomoTypeEnum } from '@prisma/client';
import { getHomoGroupName } from '../../../apprByGroup/appr-group.section';

export interface IExamsByRiskByHierarchyData {
  hierarchyData: IHierarchyData;
  exams: IExamOrigins[];
  companyId: string;
  withGroup?: boolean;
  concatExamsAndRisks?: boolean;
  mergeCells?: boolean;
  homoGroupTree: IHomoGroupMap;
}

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

function sortRowsByColumns(data: bodyTableProps[][], maxColumns?: number): bodyTableProps[][] {
  return data.sort((a, b) => {
    let columnIndex = 0;
    let comparisonResult = customSort(a, b, columnIndex);

    while (comparisonResult === 0) {
      columnIndex++;

      if (columnIndex === maxColumns) {
        break;
      }

      comparisonResult = customSort(a, b, columnIndex);
    }

    return comparisonResult;
  });
}

export const examsByHierarchyConverter = ({
  companyId,
  exams,
  hierarchyData,
  concatExamsAndRisks,
  withGroup,
  homoGroupTree,
  mergeCells,
}: IExamsByRiskByHierarchyData) => {
  const rows: bodyTableProps[][] = [];
  const hierarchyType: Record<string, string> = {};
  const hierarchyTypeArray: bodyTableProps[] = [];

  Array.from(hierarchyData.entries()).forEach(([, hierarchy]) => {
    hierarchy.org.forEach((org) => {
      if (!hierarchyType[org.typeEnum]) {
        hierarchyType[org.typeEnum] = org.typeEnum;
        hierarchyTypeArray[HierarchyPlanMap[org.typeEnum].position] = { text: '', size: 3, fontSize: 8 };
      }
    });
  });

  if (withGroup) hierarchyTypeArray.push({ text: '', size: 3, fontSize: 8 });

  const hierarchyExamsMap = examsByGroupGetData(hierarchyData, exams, companyId);

  const data = Array.from(hierarchyData.entries()).map(([id, hierarchy]) => ({ id, ...hierarchy }));

  data.forEach(({ id, ...hierarchy }) => {
    const examArray = Object.values(hierarchyExamsMap[id])
      .flat()
      .sort((b, a) =>
        sortNumber(
          (a.origin.isAdmission ? 1 : 0) +
          (a.origin.isPeriodic ? 4 : 0) +
          (a.origin.isDismissal ? 7 : 0) +
          (a.origin.isChange ? 10 : 0) +
          (a.origin.isReturn ? 50 : 0),
          (b.origin.isAdmission ? 1 : 0) +
          (b.origin.isPeriodic ? 4 : 0) +
          (b.origin.isDismissal ? 7 : 0) +
          (b.origin.isChange ? 10 : 0) +
          (b.origin.isReturn ? 50 : 0),
        ),
      )
      .sort((a, b) => sortNumber(a.origin.validityInMonths || 0, b.origin.validityInMonths || 0));

    if (examArray.length && concatExamsAndRisks) {
      const examDataMap: Record<string, { name: string; origin?: IExamOriginData }[]> = {};
      examArray.forEach((examOrigin) => {
        const key = `${examOrigin.origin?.validityInMonths}${examOrigin.origin?.isChange ? 1 : 0}${examOrigin.origin?.isAdmission ? 1 : 0}${examOrigin.origin?.isDismissal ? 1 : 0}${examOrigin.origin?.isPeriodic ? 1 : 0}${examOrigin.origin?.isReturn ? 1 : 0}`;
        if (!examDataMap[key]) examDataMap[key] = [];

        examDataMap[key].push(examOrigin);
      });

      Object.values(examDataMap).forEach((examData) => {
        const cells: bodyTableProps[] = [];
        const risks = examData.map((examOrigin) => examOrigin.origin?.risk);
        const riskId = risks.length == 1 && risks[0]?.id;

        const isAll = getIsAll(riskId, risks[0]?.name);
        const text = isAll
          ? 'não vinculado a risco específico'
          : removeDuplicate(risks.map((risk) => (getIsAll(risk?.id, risk?.name) ? '' : risk?.name)).filter(Boolean), {
            simpleCompare: true,
          }).join('\n');

        cells[ExamByHierarchyColumnEnum.RISKS] = {
          text,
          size: 5,
          ...(isAll && { color: palette.text.simple.string }),
          fontSize: 10,
        };

        const exams = removeDuplicate(
          examData.map((examOrigin) => examOrigin.name),
          { simpleCompare: true },
        ).join('\n');

        cells[ExamByHierarchyColumnEnum.EXAMS] = { text: exams, size: 5, fontSize: 10 };
        cells[ExamByHierarchyColumnEnum.PERIODICIDADE] = {
          text: examData[0]?.origin.isPeriodic ? String(examData[0].origin.validityInMonths || '-') : '',
          size: 1,
        };
        cells[ExamByHierarchyColumnEnum.PRE_ADMISSION] = { ...getX(examData[0]?.origin.isAdmission), size: 1 };
        cells[ExamByHierarchyColumnEnum.RETURN_TO_WORK] = { ...getX(examData[0]?.origin.isReturn), size: 1 };
        cells[ExamByHierarchyColumnEnum.CHANGE_RISK] = { ...getX(examData[0]?.origin.isChange), size: 1 };
        cells[ExamByHierarchyColumnEnum.DEMISSIONAL] = { ...getX(examData[0]?.origin.isDismissal), size: 1 };

        cells.unshift(...clone(hierarchyTypeArray));

        hierarchy.org.forEach((org) => {
          cells[HierarchyPlanMap[org.typeEnum].position].text = org?.name || '';
        });

        if (withGroup) {
          const homoGroupsNames: string[] = [];
          hierarchy.allHomogeneousGroupIds.forEach((id) => {
            if (homoGroupTree[id]?.type !== HomoTypeEnum.HIERARCHY) homoGroupsNames.push(homoGroupTree[id]?.name);
          });

          cells[hierarchyTypeArray.length - 1] = { text: homoGroupsNames.join('\n'), size: 3, fontSize: 8 };
        }

        rows.push(cells);
      });

      return;
    }

    examArray.forEach((examOrigin) => {
      const cells: bodyTableProps[] = [];
      const riskId = examOrigin.origin?.risk?.id;

      const rowSpan = undefined;

      const isAll = getIsAll(riskId, examOrigin.origin?.risk?.name);
      const text = isAll ? 'não vinculado a risco específico' : examOrigin.origin?.risk?.name || '';

      cells[ExamByHierarchyColumnEnum.RISKS] = {
        text,
        size: 5,
        rowSpan,
        ...(isAll && { color: palette.text.simple.string }),
        fontSize: 10,
      };

      cells[ExamByHierarchyColumnEnum.EXAMS] = { text: examOrigin.name, size: 5, fontSize: 10 };
      cells[ExamByHierarchyColumnEnum.PERIODICIDADE] = {
        text: examOrigin.origin.isPeriodic ? String(examOrigin.origin.validityInMonths || '-') : '',
        size: 1,
      };
      cells[ExamByHierarchyColumnEnum.PRE_ADMISSION] = { ...getX(examOrigin.origin.isAdmission), size: 1 };
      cells[ExamByHierarchyColumnEnum.RETURN_TO_WORK] = { ...getX(examOrigin.origin.isReturn), size: 1 };
      cells[ExamByHierarchyColumnEnum.CHANGE_RISK] = { ...getX(examOrigin.origin.isChange), size: 1 };
      cells[ExamByHierarchyColumnEnum.DEMISSIONAL] = { ...getX(examOrigin.origin.isDismissal), size: 1 };

      cells.unshift(...clone(hierarchyTypeArray));

      hierarchy.org.forEach((org) => {
        cells[HierarchyPlanMap[org.typeEnum].position].text = org?.name || '';
      });

      if (withGroup) {
        const homoGroupsNames: string[] = [];
        hierarchy.allHomogeneousGroupIds.forEach((id) => {
          if (homoGroupTree[id]?.type !== HomoTypeEnum.HIERARCHY)
            homoGroupsNames.push(getHomoGroupName(homoGroupTree[id]).nameOrigin);
        });

        cells[hierarchyTypeArray.length - 1] = { text: homoGroupsNames.join('\n'), size: 3, fontSize: 8 };
      }

      rows.push(cells);
    });
  });

  const sortedRows = sortRowsByColumns(rows, hierarchyTypeArray.length - 1);

  const reapetedCount = [];
  const referenceIndexes = [];
  const cellLength = hierarchyTypeArray.length + 2;

  if (mergeCells) {
    sortedRows.forEach((row, indexRow) => {
      const isLastRow = indexRow === sortedRows.length - 1;
      row.slice(0, cellLength).forEach((cell, indexCell) => {
        const referenceIndex = referenceIndexes[indexCell] || 0;
        if (referenceIndex === indexRow) return;

        const count = reapetedCount[indexCell] || 1;
        const referenceCell = sortedRows[referenceIndex]?.[indexCell];

        const sameText = cell.text === referenceCell?.text;
        if (sameText) {
          reapetedCount[indexCell] = count + 1;
          sortedRows[indexRow][indexCell].text = '--deleted--';
        }

        if (!sameText || isLastRow) {
          Array.from({ length: cellLength }).forEach((_, allIndexes) => {
            if (indexCell > allIndexes) return;

            const allReferenceIndex = referenceIndexes[allIndexes] || 0;
            const allReapetedCount = reapetedCount[allIndexes] || 1;

            sortedRows[allReferenceIndex][allIndexes].rowSpan = allReapetedCount;
            sortedRows[allReferenceIndex][allIndexes].verticalAlign = VerticalAlign.TOP;

            reapetedCount[allIndexes] = 1;
            referenceIndexes[allIndexes] = indexRow;
          });
        }
      });
    });
  }

  return sortedRows.map((row) => row.filter((cell) => cell.text !== '--deleted--'));
};

const examsByGroupGetData = (hierarchyData: IHierarchyData, exams: IExamOrigins[], companyId: string) => {
  const hierarchyExamsMap: Record<string, Record<string, { name: string; origin?: IExamOriginData }[]>> = {};

  hierarchyData.forEach((hierarchy, id) => {
    if (!hierarchyExamsMap[id]) hierarchyExamsMap[id] = {};

    hierarchy.org
      .map((org) => ({ id: org.id }))
      .forEach((hierarchy) => {
        const origins = filterOriginsByHierarchy(exams, companyId, hierarchy.id, { docType: 'isPCMSO' });

        origins.forEach((originInfo) => {
          if (!hierarchyExamsMap[id][originInfo.exam.id]) hierarchyExamsMap[id][originInfo.exam.id] = [];

          originInfo.origins.forEach((origin) => {
            hierarchyExamsMap[id][originInfo.exam.id].push({ name: originInfo.exam.name, origin });
          });
        });
      });
  });

  return removeExamsDuplicated(hierarchyExamsMap);
};
