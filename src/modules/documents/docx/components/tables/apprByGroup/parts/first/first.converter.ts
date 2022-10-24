import dayjs from 'dayjs';
import { AlignmentType } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../../../sst/entities/riskGroupData.entity';

import {
  HierarchyMapData,
  IHomoGroupMap,
} from '../../../../../converter/hierarchy.converter';
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import {
  FirstRiskInventoryColumnEnum,
  firstRiskInventoryHeader,
} from './first.constant';

export const documentConverter = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  homoGroupTree: IHomoGroupMap,
  hierarchy: HierarchyMapData,
  isByGroup: boolean,
) => {
  const rows: bodyTableProps[][] = [];
  const homogeneousGroups = [];
  const environments = [];

  rows.push(
    firstRiskInventoryHeader.map((data) => ({
      ...data,
      size: 4,
      borders: borderNoneStyle,
    })),
  );

  const docData = [];

  docData[FirstRiskInventoryColumnEnum.SOURCE] =
    riskFactorGroupData.source || '';
  docData[FirstRiskInventoryColumnEnum.REVIEW] =
    riskFactorGroupData.revisionBy || '';
  docData[FirstRiskInventoryColumnEnum.ELABORATION_BY] =
    riskFactorGroupData.elaboratedBy || '';
  docData[FirstRiskInventoryColumnEnum.APPROVE_BY] =
    riskFactorGroupData.approvedBy || '';
  docData[FirstRiskInventoryColumnEnum.DATA] =
    dayjs(riskFactorGroupData.visitDate).format('DD/MM/YYYY') || '';
  docData[FirstRiskInventoryColumnEnum.UNIT] = hierarchy.workspace || '';

  rows.push(
    docData.map((data) => ({
      text: data,
      size: 26,
      borders: borderNoneStyle,
    })),
  );

  // add hierarchy table header
  rows.push(
    docData.map((_, index) => {
      if (!hierarchy.org[index])
        return { text: '', size: 10, borders: borderNoneStyle };

      if (hierarchy.org[index]?.homogeneousGroup) {
        homogeneousGroups.push(hierarchy.org[index].homogeneousGroup);
      }

      if (hierarchy.org[index]?.environments) {
        environments.push(hierarchy.org[index].environments);
      }

      const cell = {
        text: hierarchy.org[index].type,
        size: 10,
        bold: true,
        borders: borderNoneStyle,
        alignment: AlignmentType.RIGHT,
      };

      if ((hierarchy as any).type == 'GSE') cell.text = '';

      return cell;
    }),
  );

  // add hierarchy table body
  rows.push(
    docData.map((_, index) => {
      if (isByGroup) return { text: '', size: 20, borders: borderNoneStyle };

      if (!hierarchy.org[index])
        return { text: '', size: 20, borders: borderNoneStyle };

      return {
        text: hierarchy.org[index].name,
        size: 20,
        borders: borderNoneStyle,
      };
    }),
  );

  // last inverted row
  rows.push(
    docData.map((_, index) => {
      const last = 0 === index;
      // const penultimate = 1 === index;
      const lastPenultimate = 2 === index;

      if (last)
        return {
          title: `${(hierarchy as any)?.type || ''}:`,
          text: homogeneousGroups.length
            ? homogeneousGroups.filter((homo) => homo).join(', ')
            : ' --',
          size: 30,
          borders: borderNoneStyle,
        };

      // if ((hierarchy as any)?.type == 'GSE' && penultimate)
      //   return {
      //     title: `Ambientes:`,
      //     text: environments.length
      //       ? environments.filter((homo) => homo).join(', ')
      //       : ' --',
      //     size: 30,
      //     borders: borderNoneStyle,
      //   };

      if (lastPenultimate)
        return {
          title: `Quantidade de Funcionários Expostos:`,
          text: String(hierarchy.employeesLength),
          size: 30,
          borders: borderNoneStyle,
        };

      return { text: '', size: 30, borders: borderNoneStyle };
    }),
  );

  const rowInverse: bodyTableProps[][] = [];

  rows.forEach((row, index) => {
    row.forEach((cell, cellIndex) => {
      rowInverse[cellIndex] = rowInverse[cellIndex] || [];
      rowInverse[cellIndex][index] = cell;
    });
  });

  return rowInverse;
};
