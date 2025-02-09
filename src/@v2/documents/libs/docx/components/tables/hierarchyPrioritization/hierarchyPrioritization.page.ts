import { HierarchyEnum } from '@prisma/client';
import { Paragraph, Table, WidthType } from 'docx';

import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { borderStyleGlobal } from '../../../base/config/styles';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { palette } from '../../../constants/palette';
import { IHierarchyData, IHierarchyMap, IRiskGroupDataConverter } from '../../../converter/hierarchy.converter';
import { bodyTableProps, TableBodyElements } from './elements/body';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
import { hierarchyPrioritizationTables } from './hierarchyPrioritization.tables';

export const hierarchyPrioritizationPage = (
  riskFactorGroupData: IRiskGroupDataConverter[],
  hierarchiesEntity: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  options: IHierarchyPrioritizationOptions = {
    hierarchyType: HierarchyEnum.OFFICE,
    isByGroup: false,
  },
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const tables = hierarchyPrioritizationTables(riskFactorGroupData, hierarchiesEntity, hierarchyTree, options);

  const tableBodyElements = new TableBodyElements();

  const iterableSections = tables
    .map((table) => {
      return [
        table,
        ...convertToDocx([
          {
            type: DocumentChildrenTypeEnum.LEGEND,
            text: '**Lengenda**',
            spacing: { after: 0 },
          },
        ]),
        new Table({
          width: { size: 40, type: WidthType.PERCENTAGE },
          rows: [
            tableBodyElements.tableRow(
              (
                [
                  {
                    text: 'Avaliação Qualitativa',
                    borders: borderStyleGlobal(palette.common.white.string),
                  },
                  {
                    text: 'Avaliação Quantitativa',
                    borders: borderStyleGlobal(palette.common.white.string),
                    shaded: true,
                  },
                ] as bodyTableProps[]
              ).map(tableBodyElements.tableCell),
            ),
          ],
        }),
        ...convertToDocx([
          {
            type: DocumentChildrenTypeEnum.LEGEND,
            text: '**MB =** Muito Baixo / **B =** Baixo / **M =** Moderado / **A =** Alto / **MA=** Muito Alto',
            spacing: { after: 0 },
          },
          {
            type: DocumentChildrenTypeEnum.LEGEND,
            text: 'Vermelho Indica Risco Priorizado Independente do critério ser Qualitativo ou Quantitativo, ou seja, Alto (A) e Muito Alto (A)',
            color: 'FF0000',
          },
        ]),
      ];
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
