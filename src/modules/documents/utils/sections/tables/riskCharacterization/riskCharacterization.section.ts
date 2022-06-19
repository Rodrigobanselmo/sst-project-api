import { PageOrientation, Table, WidthType } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
import { riskCharacterizationHeader } from '../riskCharacterization/riskCharacterization.constant';

import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { riskCharacterizationConverter } from './riskCharacterization.converter';

export const riskCharacterizationTableSection = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
) => {
  const riskCharacterizationData =
    riskCharacterizationConverter(riskFactorGroupData);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(
        riskCharacterizationHeader.map(tableHeaderElements.headerCell),
      ),
      ...riskCharacterizationData.map((data) =>
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
