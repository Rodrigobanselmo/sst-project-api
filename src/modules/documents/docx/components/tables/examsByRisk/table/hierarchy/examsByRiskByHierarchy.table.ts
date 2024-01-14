import { HeightRule, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewExamsByHierarchyHeader } from './examsByRiskByHierarchy.constant';
import { IExamsByRiskByHierarchyData, examsByHierarchyConverter } from './examsByRiskByHierarchy.converter';

export const examsByRiskByHierarchyTable = ({ companyId, exams, hierarchyData, concatExamsAndRisks, withGroup, homoGroupTree, mergeCells }: IExamsByRiskByHierarchyData) => {
  const data = examsByHierarchyConverter({ companyId, exams, hierarchyData, concatExamsAndRisks, withGroup, homoGroupTree, mergeCells });

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(NewExamsByHierarchyHeader(hierarchyData, { withGroup }).map(tableHeaderElements.headerCell), { height: { value: 900, rule: HeightRule.EXACT }, }),
      ...data.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
