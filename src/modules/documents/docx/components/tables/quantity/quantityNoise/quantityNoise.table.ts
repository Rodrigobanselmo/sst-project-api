import { DocumentDataEntity } from './../../../../../../sst/entities/documentData.entity';
import { DocumentDataPGRDto } from './../../../../../../sst/dto/document-data-pgr.dto';
import { Table, WidthType } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from './../../../../converter/hierarchy.converter';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { NewQuantityNoiseHeader } from './quantityNoise.constant';
import { quantityNoiseConverter } from './quantityNoise.converter';

export const quantityNoiseTable = (riskGroupData: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto, hierarchyTree: IHierarchyMap) => {
  const quantityNoiseData = quantityNoiseConverter(riskGroupData, hierarchyTree);
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();
  const quantityNoiseHeader = NewQuantityNoiseHeader(riskGroupData.isQ5 ? '5' : '3');

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(quantityNoiseHeader.map(tableHeaderElements.headerCell)),
      ...quantityNoiseData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
