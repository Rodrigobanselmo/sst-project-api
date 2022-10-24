import { PageOrientation, Table, WidthType } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { versionControlHeader } from './versionControl.constant';

import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { versionControlConverter } from './versionControl.converter';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';

export const versionControlTable = (
  riskDocumentEntity: RiskDocumentEntity[],
) => {
  const versionControlData = versionControlConverter(riskDocumentEntity);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        versionControlHeader.map(tableHeaderElements.headerCell),
      ),
      ...versionControlData.map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
      ),
    ],
  });

  return table;
};
