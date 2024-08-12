import { HeightRule, Table, WidthType } from 'docx';
import { IExamOrigins } from '../../../../../../../sst/entities/exam.entity';

import { IHierarchyMap, IHomoGroupMap } from '../../../../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { examsByGroupConverter } from './examsByRiskByGroup.converter';
import { examsByGroupHeader } from './examsByGroupRisk.constant';

export const examsByRiskByGroupTable = (
  homoMap: IHomoGroupMap,
  exams: IExamOrigins[],
  hierarchyTree: IHierarchyMap,
) => {
  const data = examsByGroupConverter(homoMap, exams, hierarchyTree);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(examsByGroupHeader.map(tableHeaderElements.headerCell), {
        height: { value: 900, rule: HeightRule.EXACT },
      }),
      ...data.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
