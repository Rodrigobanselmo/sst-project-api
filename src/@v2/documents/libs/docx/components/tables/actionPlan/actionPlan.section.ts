import { ISectionOptions, PageOrientation, Table, WidthType } from 'docx';

import { sectionTitleOnlyHeadersFooters } from '../../../base/layouts/annex/sectionTitleOnlyHeadersFooters';
import { IDocumentRiskGroupDataConverter, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { actionPlanHeader, actionPlanSectionTitle } from './actionPlan.constant';
import { actionPlanConverter } from './actionPlan.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';

export const actionPlanAnnexSectionHeadersFooters = () => sectionTitleOnlyHeadersFooters(actionPlanSectionTitle);

export const actionPlanTableSection = (document: IDocumentRiskGroupDataConverter, hierarchyTree: IHierarchyMap) => {
  const actionPlanData = actionPlanConverter(document.riskGroupData, document.documentVersion, hierarchyTree);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
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
  } satisfies ISectionOptions;

  return section;
};
