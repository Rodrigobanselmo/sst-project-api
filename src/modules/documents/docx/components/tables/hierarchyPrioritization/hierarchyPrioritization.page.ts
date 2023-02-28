import { HierarchyEnum } from '@prisma/client';
import { Paragraph, Table, WidthType } from 'docx';
import { palette } from '../../../../../../shared/constants/palette';

import { borderStyleGlobal } from '../../../base/config/styles';
import { ISectionChildrenType, DocumentSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { IHierarchyData, IHierarchyMap } from '../../../converter/hierarchy.converter';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { bodyTableProps, TableBodyElements } from './elements/body';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
import { hierarchyPrioritizationTables } from './hierarchyPrioritization.tables';

export const hierarchyPrioritizationPage = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
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
            type: DocumentSectionChildrenTypeEnum.LEGEND,
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
            type: DocumentSectionChildrenTypeEnum.LEGEND,
            text: '**MB =** Muito Baixo / **B =** Baixo / **M =** Moderado / **A =** Alto / **MA=** Muito Alto',
            spacing: { after: 0 },
          },
          {
            type: DocumentSectionChildrenTypeEnum.LEGEND,
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
