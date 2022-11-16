import { Footer, Header, PageOrientation, Table, WidthType } from 'docx';

import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { ConverterProps, hierarchyPlanConverter } from './hierarchyHomoOrg.converter';
import { hierarchyHomoOrgTable } from './hierarchyHomoOrg.table';

export const hierarchyHomoOrgSection = (
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
  const { table } = hierarchyHomoOrgTable(hierarchiesEntity, homoGroupTree, {
    showDescription,
    showHomogeneous,
    showHomogeneousDescription,
    type,
    groupIdFilter,
  });

  const section = {
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
    footers: {
      default: new Footer({
        children: [],
      }),
    },
    headers: {
      default: new Header({
        children: [],
      }),
    },
  };

  return section;
};
