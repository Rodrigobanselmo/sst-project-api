import dayjs from 'dayjs';
import { AlignmentType } from 'docx';

import { HierarchyMapData, IDocumentRiskGroupDataConverter, IHomoGroupMap } from '../../../../../converter/hierarchy.converter';
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { FirstRiskInventoryColumnEnum, firstRiskInventoryHeader } from './first.constant';

export const documentConverter = (
  riskFactorGroupData: IDocumentRiskGroupDataConverter,
  _homoGroupTree: IHomoGroupMap,
  hierarchy: HierarchyMapData,
  isByGroup: boolean,
) => {
  const rows: bodyTableProps[][] = [];
  const homogeneousGroups = [] as string[];
  const environments = [] as string[];

  rows.push(
    firstRiskInventoryHeader.map((data) => ({
      ...data,
      size: 4,
      borders: borderNoneStyle,
    })),
  );

  const docData = [] as string[];

  docData[FirstRiskInventoryColumnEnum.SOURCE] = riskFactorGroupData.documentVersion.documentBase.data.source || '';
  docData[FirstRiskInventoryColumnEnum.REVIEW] = riskFactorGroupData.documentVersion.documentBase.revisionBy || '';
  docData[FirstRiskInventoryColumnEnum.ELABORATION_BY] = riskFactorGroupData.documentVersion.documentBase.elaboratedBy || '';
  docData[FirstRiskInventoryColumnEnum.APPROVE_BY] = riskFactorGroupData.documentVersion.documentBase.approvedBy || '';
  docData[FirstRiskInventoryColumnEnum.DATA] = dayjs(riskFactorGroupData.documentVersion.documentBase.data.visitDate).format('DD/MM/YYYY') || '';
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
      if (!hierarchy.org[index]) return { text: '', size: 10, borders: borderNoneStyle };

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

      if (isByGroup) cell.text = '';

      return cell;
    }),
  );

  // add hierarchy table body
  rows.push(
    docData.map((_, index) => {
      if (isByGroup) return { text: '', size: 20, borders: borderNoneStyle };

      if (!hierarchy.org[index]) return { text: '', size: 20, borders: borderNoneStyle };

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
      const penultimate = 1 === index;
      const lastPenultimate = 2 === index;

      if (last)
        return {
          title: `GSE:`,
          text: homogeneousGroups.length ? homogeneousGroups.filter((homo) => homo).join(', ') : ' --',
          size: 30,
          borders: borderNoneStyle,
        };

      if (penultimate)
        return {
          title: `Ambientes:`,
          text: environments.length ? environments.filter((homo) => homo).join(', ') : ' --',
          size: 30,
          borders: borderNoneStyle,
        };

      if (lastPenultimate)
        return {
          title: `Quantidade de Funcionários Expostos:`,
          text: String(hierarchy.employeesLength || hierarchy.subEmployeesLength),
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
