import { CharacterizationTypeEnum } from '@prisma/client';
import { AlignmentType, Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { characterizationsConverter } from './characterization.converter';
import {
  IHierarchyData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { hierarchyHomoOrgTable } from '../../tables/hierarchyHomoOrg/hierarchyHomoOrg.table';
import { getCharacterizationType } from '../../../../../../modules/company/repositories/implementations/CharacterizationRepository';

export const characterizationSections = (
  characterizationsData: CharacterizationEntity[],
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  const sections: (Paragraph | Table)[][] = [];

  [
    { title: 'Posto de Trabalho', type: CharacterizationTypeEnum.WORKSTATION },
    {
      title: 'Atividades',
      type: CharacterizationTypeEnum.ACTIVITIES,
    },
    {
      title: 'Equipamentos',
      type: CharacterizationTypeEnum.EQUIPMENT,
    },
  ].forEach(({ type, title: titleSection }) => {
    const characterizations = characterizationsData.filter(
      (e) => e.type === type,
    );
    if (!characterizations?.length) return;

    const characterizationData = characterizationsConverter(characterizations);
    characterizationData.forEach(
      (
        {
          variables,
          elements,
          type,
          risks,
          considerations: cons,
          breakPage,
          id,
          activities: ac,
        },
        index,
      ) => {
        const parameters: ISectionChildrenType[] = [];
        const riskFactors: ISectionChildrenType[] = [];
        const considerations: ISectionChildrenType[] = [];
        const activities: ISectionChildrenType[] = [];
        const offices: (Table | Paragraph)[] = [];

        if (variables[VariablesPGREnum.CHARACTERIZATION_NOISE]) {
          parameters.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `Ruído ambiente (Maior Valor Medido): ??${VariablesPGREnum.CHARACTERIZATION_NOISE}?? dB(A)`,
          });
        }

        if (variables[VariablesPGREnum.CHARACTERIZATION_TEMPERATURE]) {
          parameters.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `Temperatura do ar: ??${VariablesPGREnum.CHARACTERIZATION_TEMPERATURE}?? ºC`,
          });
        }

        if (variables[VariablesPGREnum.CHARACTERIZATION_MOISTURE]) {
          parameters.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `Umidade do ar: ??${VariablesPGREnum.CHARACTERIZATION_MOISTURE}??%`,
          });
        }

        if (variables[VariablesPGREnum.CHARACTERIZATION_LUMINOSITY]) {
          parameters.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `Iluminância: ??${VariablesPGREnum.CHARACTERIZATION_LUMINOSITY} LUX`,
          });
        }

        if (parameters.length) {
          parameters.unshift({
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: '**Parâmetros ambientais:**',
            spacing: { after: 100 },
          });
        }

        risks.forEach((risk, index) => {
          if (index === 0)
            riskFactors.push({
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '**Fatores de risco:**',
              spacing: { after: 100 },
            });

          riskFactors.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `${risk.name} (${risk.type})`,
            alignment: AlignmentType.START,
          });

          // if (index === risks.length - 1)
          //   riskFactors.push({
          //     type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          //     text: '',
          //     removeWithSomeEmptyVars: [VariablesPGREnum.CHARACTERIZATION_DESC],
          //   });
        });

        cons.forEach((consideration, index) => {
          if (index === 0)
            considerations.push({
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '**Considerações:**',
              spacing: { after: 100 },
            });

          considerations.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: consideration,
          });
        });

        ac.forEach((activity, index) => {
          if (index === 0)
            activities.push({
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '**Relação das atividades e tarefas executadas:**',
              spacing: { after: 100 },
            });

          activities.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: activity,
          });
        });

        const title = [
          {
            type: PGRSectionChildrenTypeEnum.H3,
            text: `${titleSection}: ??${VariablesPGREnum.CHARACTERIZATION_NAME}??`,
          },
        ] as ISectionChildrenType[];

        const { table: officesTable, missingBody } = hierarchyHomoOrgTable(
          hierarchiesTreeOrg,
          homoGroupTree,
          {
            showDescription: false,
            showHomogeneous: true,
            type: getCharacterizationType(type),
            groupIdFilter: id,
          },
        );

        if (!missingBody) {
          const titleTable = [
            {
              type: PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
              text: `Cargos  lotados no ${titleSection} ??${VariablesPGREnum.CHARACTERIZATION_NAME}??`,
            },
          ] as ISectionChildrenType[];

          offices.push(...convertToDocx(titleTable, variables));
          offices.push(officesTable);
        }

        const section = [
          ...convertToDocx([...title], variables),
          ...elements,
          ...convertToDocx(
            [
              ...riskFactors,
              {
                type: PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: `??${VariablesPGREnum.CHARACTERIZATION_DESC}??`,
                alignment: AlignmentType.START,
                removeWithSomeEmptyVars: [
                  VariablesPGREnum.CHARACTERIZATION_DESC,
                ],
              },
              ...parameters,
              ...activities,
              ...considerations,
            ],
            variables,
          ),
          ...offices,
        ];

        if (index == 0)
          section.unshift(
            ...convertToDocx([
              {
                type: PGRSectionChildrenTypeEnum.H2,
                text: titleSection,
              },
            ]),
          );

        if (breakPage || sections.length === 0) sections.push(section);
        else
          sections[sections.length - 1] = [
            ...(sections[sections.length - 1] || []),
            ...section,
          ];
      },
    );
  });

  return sections.map((section) => ({
    footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    children: section,
  }));
};
