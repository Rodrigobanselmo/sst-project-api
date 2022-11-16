import { Footer, Header, PageOrientation, Table, WidthType } from 'docx';

import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { ConverterProps, hierarchyPlanConverter } from './hierarchyHomoOrg.converter';

export const hierarchyHomoOrgTable = (
  hierarchiesEntity: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter }: ConverterProps = {
    showHomogeneous: true,
    showDescription: true,
    showHomogeneousDescription: false,
    type: undefined,
    groupIdFilter: undefined,
  },
) => {
  const { bodyData, headerData } = hierarchyPlanConverter(hierarchiesEntity, homoGroupTree, {
    showDescription,
    showHomogeneous,
    type,
    showHomogeneousDescription,
    groupIdFilter,
  });

  const groupName = () => {
    if (!type) return 'GSE';
    if (type === 'ENVIRONMENT') return 'Ambiente';
    return 'Mão de Obra';
  };
  if (showHomogeneous) headerData[0].text = groupName();
  if (showHomogeneous && !showHomogeneousDescription) headerData.splice(1, 1);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(headerData.map(tableHeaderElements.headerCell)),
      ...bodyData.filter((data) => data).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  const missingBody = bodyData.length === 0;

  return { table, missingBody };
};
