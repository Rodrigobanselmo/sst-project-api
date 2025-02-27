import { Table, WidthType } from 'docx';
import { versionControlHeader } from './versionControl.constant';

import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { versionControlConverter } from './versionControl.converter';
import { VersionModel } from '@/@v2/documents/domain/models/version.model';

export const versionControlTable = (riskDocumentEntity: VersionModel[]) => {
  const versionControlData = versionControlConverter(riskDocumentEntity);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(versionControlHeader.map(tableHeaderElements.headerCell)),
      ...versionControlData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
    ],
  });

  return table;
};
