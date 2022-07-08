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

export const characterizationSections = (
  characterizationsData: CharacterizationEntity[],
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
        { variables, elements, risks, considerations: cons, breakPage },
        index,
      ) => {
        const parameters: ISectionChildrenType[] = [];
        const riskFactors: ISectionChildrenType[] = [];
        const considerations: ISectionChildrenType[] = [];

        risks.forEach((risk, index) => {
          if (index === 0)
            riskFactors.push({
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '**Fatores de risco:**',
            });

          riskFactors.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `${risk.name} (${risk.type})`,
            alignment: AlignmentType.START,
          });

          if (index === risks.length - 1)
            riskFactors.push({
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '',
              removeWithSomeEmptyVars: [VariablesPGREnum.CHARACTERIZATION_DESC],
            });
        });

        cons.forEach((consideration, index) => {
          if (index === 0)
            considerations.push({
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '**Considerações:**',
            });

          considerations.push({
            type: PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: consideration,
          });
        });

        const title = [
          {
            type: PGRSectionChildrenTypeEnum.H3,
            text: `${titleSection}: ??${VariablesPGREnum.CHARACTERIZATION_NAME}??`,
          },
        ] as ISectionChildrenType[];

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
              ...considerations,
            ],
            variables,
          ),
        ];

        if (breakPage) sections.push(section);
        else
          sections[sections.length - 1] = [
            ...(sections[sections.length - 1] || []),
            ...section,
          ];

        if (index == 0)
          sections[sections.length - 1] = [
            ...convertToDocx([
              {
                type: PGRSectionChildrenTypeEnum.H2,
                text: titleSection,
              },
            ]),
            ...(sections[sections.length - 1] || []),
          ];
      },
    );
  });

  return sections.map((section) => ({
    footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    children: section,
  }));
};
