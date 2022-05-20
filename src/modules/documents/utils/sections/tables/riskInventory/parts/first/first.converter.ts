import dayjs from 'dayjs';
import { AlignmentType } from 'docx';
import { RiskFactorGroupDataEntity } from 'src/modules/checklist/entities/riskGroupData.entity';

import { MapData } from '../../converter/hierarchy.converter';
import { bodyTableProps, borderNoneStyle } from '../../elements/body';
import { firstRiskInventoryHeader } from './first.constant';

export const documentConverter = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchy: MapData,
) => {
  const rows: bodyTableProps[][] = [];
  const homogeneousGroups = [];

  rows.push(
    firstRiskInventoryHeader.map((data) => ({
      ...data,
      size: 4,
      borders: borderNoneStyle,
    })),
  );

  const docData = [
    riskFactorGroupData.source || '',
    riskFactorGroupData.elaboratedBy || '',
    riskFactorGroupData.revisionBy || '',
    riskFactorGroupData.approvedBy || '',
    dayjs(riskFactorGroupData.visitDate).format('DD/MM/YYYY') || '',
    hierarchy.workspace || '',
  ];

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

      return {
        text: hierarchy.org[index].type,
        size: 10,
        bold: true,
        borders: borderNoneStyle,
        alignment: AlignmentType.RIGHT,
      };
    }),
  );

  // add hierarchy table body
  rows.push(
    docData.map((_, index) => {
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
      const penultimate = 1 === index;

      if (last)
        return {
          title: `GSE:`,
          text: homogeneousGroups.length ? homogeneousGroups.join(', ') : ' --',
          size: 30,
          borders: borderNoneStyle,
        };

      if (penultimate)
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
