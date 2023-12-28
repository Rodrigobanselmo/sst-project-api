import { HeightRule, Table, WidthType } from 'docx';
import { IExamOrigins } from '../../../../../../../sst/entities/exam.entity';
import { examsByGroupHeader } from '../../examsByRisk.constant';
import { CompanyEntity } from './../../../../../../../company/entities/company.entity';

import { IHierarchyData, IHierarchyMap } from '../../../../../converter/hierarchy.converter';
import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { examsByHierarchyConverter } from './examsByRiskByHierarchy.converter';

export const examsByRiskByHierarchyTable = (hierarchyData: IHierarchyData, exams: IExamOrigins[], companyId: string, hierarchyTree: IHierarchyMap) => {
  const data = examsByHierarchyConverter(hierarchyData, exams, companyId, hierarchyTree);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(examsByGroupHeader.map(tableHeaderElements.headerCell), { height: { value: 900, rule: HeightRule.EXACT }, }),
      ...data.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
