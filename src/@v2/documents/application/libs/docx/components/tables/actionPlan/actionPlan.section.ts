import { PageOrientation, Table, WidthType } from 'docx';

import { IHierarchyMap, IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { actionPlanHeader, actionPlanTitle } from './actionPlan.constant';
import { actionPlanConverter } from './actionPlan.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';

export const actionPlanTableSection = (
  riskFactorGroupData: IRiskGroupDataConverter[],
  documentVersion: DocumentVersionModel,
  hierarchyTree: IHierarchyMap,
) => {
  const actionPlanData = actionPlanConverter(riskFactorGroupData, documentVersion, hierarchyTree);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerTitle(actionPlanTitle, actionPlanHeader.length),
      tableHeaderElements.headerRow(actionPlanHeader.map(tableHeaderElements.headerCell)),
      ...actionPlanData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  const section = {
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  };

  return section;
};
