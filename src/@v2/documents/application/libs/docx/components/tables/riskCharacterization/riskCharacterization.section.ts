import { PageOrientation, Table, WidthType } from 'docx';
import { riskCharacterizationHeader } from './riskCharacterization.constant';

import { RiskDataExamModel } from '@/@v2/documents/domain/models/risk-data-exam.model';
import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { TableBodyElements } from './elements/body';
import { TableHeaderElements } from './elements/header';
import { riskCharacterizationConverter } from './riskCharacterization.converter';

export const riskCharacterizationTableSection = (
  risksdata: RiskDataModel[],
  getRiskDataExams: (riskData: RiskDataModel) => RiskDataExamModel[]
) => {
  const riskCharacterizationData = riskCharacterizationConverter(risksdata, getRiskDataExams);

  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(riskCharacterizationHeader.map(tableHeaderElements.headerCell)),
      ...riskCharacterizationData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
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
