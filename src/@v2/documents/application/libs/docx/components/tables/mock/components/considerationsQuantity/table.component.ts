import {
  ISectionChildrenType,
} from '../../../../../../../../domain/types/elements.types';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { HeightRule, Paragraph, Table, WidthType } from 'docx';

import { TableBodyElements } from '../../elements/body';
import { TableHeaderElements } from '../../elements/header';
import { NewBody } from './body.converter';
import { NewHeader } from './header.converter';
import { IDocVariables } from '../../../../../builders/pgr/types/documet-section-groups.types';

// Table 2
export const considerationsQuantityTable = (
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const tableHeaderElements = new TableHeaderElements();
  const tableBodyElements = new TableBodyElements();

  const tableComponent = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableHeaderElements.headerRow(NewHeader().map(tableHeaderElements.headerCell), {
        height: { value: 350, rule: HeightRule.ATLEAST },
      }),
      ...NewBody().map((data) =>
        tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
          height: { value: 350, rule: HeightRule.ATLEAST },
        }),
      ),
    ],
  });

  const table = convertToDocx([
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
      text: 'Nível de ação recomendado em função do DPG',
    },
  ]);

  return [...table, tableComponent];
};
