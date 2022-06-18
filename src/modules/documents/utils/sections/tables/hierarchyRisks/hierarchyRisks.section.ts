import { HierarchyEnum } from '@prisma/client';
import { PageOrientation, Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { IHierarchyData } from '../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import {
  hierarchyRisksConverter,
  IHierarchyRiskOptions,
} from './hierarchyRisks.converter';

export const hierarchyRisksTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchiesEntity: IHierarchyData,
  options: IHierarchyRiskOptions = {
    hierarchyType: HierarchyEnum.SECTOR,
  },
) => {
  const { bodyData, headerData } = hierarchyRisksConverter(
    riskFactorGroupData,
    hierarchiesEntity,
    options,
  );

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        headerData.map(tableHeaderElements.headerCell),
      ),
      ...bodyData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
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
