import { Table, WidthType } from 'docx';
import { versionControlHeader } from './versionControl.constant';

import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { versionControlConverter } from './versionControl.converter';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { VersionControlTableOptions } from './version-control.types';
import { versionControlValidityRow } from './version-control-validity.row';

export const versionControlTable = (
  riskDocumentEntity: RiskDocumentEntity[],
  options: VersionControlTableOptions = {},
) => {
  const versionControlData = versionControlConverter(
    riskDocumentEntity,
    options.fallback,
  );

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const rows = [
    tableHeaderElements.headerRow(
      versionControlHeader.map(tableHeaderElements.headerCell),
    ),
    ...versionControlData.map((data) =>
      tableBodyElements.tableRow(data.map(tableBodyElements.tableCell)),
    ),
  ];

  if (options.validity) {
    rows.push(versionControlValidityRow(options.validity));
  }

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });

  return table;
};
