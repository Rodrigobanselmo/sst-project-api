import { RiskFactorGroupDataEntity } from './../../../../../checklist/entities/riskGroupData.entity';
import { Paragraph, Table, WidthType } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import {
  IHierarchyData,
  IHierarchyMap,
} from '../../../converter/hierarchy.converter';
import { IHierarchyPrioritizationOptions } from './hierarchyPrioritization.converter';
import { HierarchyEnum } from '@prisma/client';
import { hierarchyPrioritizationTables } from './hierarchyPrioritization.tables';
import { TableHeaderElements } from './elements/header';
import { bodyTableProps, TableBodyElements } from './elements/body';

export const hierarchyPrioritizationPage = (
  riskFactorGroupData: RiskFactorGroupDataEntity,
  hierarchiesEntity: IHierarchyData,
  hierarchyTree: IHierarchyMap,
  options: IHierarchyPrioritizationOptions = {
    hierarchyType: HierarchyEnum.OFFICE,
    isByGroup: false,
  },
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  const tables = hierarchyPrioritizationTables(
    riskFactorGroupData,
    hierarchiesEntity,
    hierarchyTree,
    options,
  );

  const tableBodyElements = new TableBodyElements();

  const iterableSections = tables
    .map((table) => {
      return [
        table,
        ...convertToDocx([
          {
            type: PGRSectionChildrenTypeEnum.LEGEND,
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
                  { text: 'Avaliação Qualitativa' },
                  { text: 'Avaliação Quantitativa', shaded: true },
                ] as bodyTableProps[]
              ).map(tableBodyElements.tableCell),
            ),
          ],
        }),
        ...convertToDocx([
          {
            type: PGRSectionChildrenTypeEnum.LEGEND,
            text: '**MB =** Muito Baixo / **B =** Baixo / **M =** Moderado / **A =** Alto / **MA=** Muito Alto',
            spacing: { after: 0 },
          },
          {
            type: PGRSectionChildrenTypeEnum.LEGEND,
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
