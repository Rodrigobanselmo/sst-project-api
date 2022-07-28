import { CharacterizationTypeEnum } from '@prisma/client';
import { AlignmentType, BorderStyle, Paragraph, Table } from 'docx';
import { sortString } from '../../../../../../shared/utils/sorts/string.sort';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import {
  IHierarchyData,
  IHomoGroupMap,
} from '../../../converter/hierarchy.converter';
import { hierarchyHomoOrgTable } from '../../tables/hierarchyHomoOrg/hierarchyHomoOrg.table';
import { EnvironmentEntity } from '../../../../../company/entities/environment.entity';
import {
  environmentsConverter,
  IEnvironmentConvertResponse,
} from './all-characterization.converter';
import { getCharacterizationType } from '../../../../../../modules/company/repositories/implementations/CharacterizationRepository';

const getData = (
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  titleSection: string,
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
  {
    variables,
    id,
    risks,
    considerations: cons,
    activities: ac,
    type,
    paragraphs,
  }: Partial<IEnvironmentConvertResponse>,
) => {
  const parameters: ISectionChildrenType[] = [];
  const riskFactors: ISectionChildrenType[] = [];
  const considerations: ISectionChildrenType[] = [];
  const offices: (Table | Paragraph)[] = [];
  const activities: ISectionChildrenType[] = [];
  const paragraphSection: ISectionChildrenType[] = [];

  if (variables[VariablesPGREnum.ENVIRONMENT_NOISE]) {
    parameters.push({
      type: PGRSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Ruído ambiente (Maior Valor Medido): ??${VariablesPGREnum.ENVIRONMENT_NOISE}?? dB(A)`,
    });
  }

  if (variables[VariablesPGREnum.ENVIRONMENT_TEMPERATURE]) {
    parameters.push({
      type: PGRSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Temperatura do ar: ??${VariablesPGREnum.ENVIRONMENT_TEMPERATURE}?? ºC`,
    });
  }

  if (variables[VariablesPGREnum.ENVIRONMENT_MOISTURE]) {
    parameters.push({
      type: PGRSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Umidade do ar: ??${VariablesPGREnum.ENVIRONMENT_MOISTURE}??%`,
    });
  }

  if (variables[VariablesPGREnum.ENVIRONMENT_LUMINOSITY]) {
    parameters.push({
      type: PGRSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Iluminância: ??${VariablesPGREnum.ENVIRONMENT_LUMINOSITY}?? LUX`,
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
  });

  paragraphs.forEach((paragraph) => {
    paragraphSection.push({
      ...getSentenceType(paragraph),
    });
  });

  cons.forEach((consideration, index) => {
    if (index === 0)
      considerations.push({
        type: PGRSectionChildrenTypeEnum.PARAGRAPH,
        text: '**Considerações:**',
        spacing: { after: 100 },
      });

    considerations.push({
      ...getSentenceType(consideration),
    });
  });

  ac.forEach((activity, index) => {
    if (index === 0)
      activities.push({
        type: PGRSectionChildrenTypeEnum.PARAGRAPH,
        text: '**Descrição dos processos de trabalho:**',
        spacing: { after: 100 },
      });

    activities.push({
      ...getSentenceType(activity),
    });
  });

  const ProfileTitle = [
    {
      type: PGRSectionChildrenTypeEnum.PARAGRAPH,
      text: `??${VariablesPGREnum.PROFILE_NAME}??`,
      size: 11,
      border: {
        bottom: {
          color: 'auto',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
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
    ...convertToDocx([...ProfileTitle], variables),
    ...convertToDocx(
      [
        ...riskFactors,
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
          alignment: AlignmentType.START,
          removeWithSomeEmptyVars: [VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
        },
        ...paragraphSection,
        ...parameters,
        ...activities,
        ...considerations,
      ],
      variables,
    ),
    ...offices,
  ];

  return section;
};

const getSentenceType = (sentence: string): ISectionChildrenType => {
  const splitSentence = sentence.split('{type}=');
  if (splitSentence.length == 2) {
    const value = splitSentence[1] as unknown as any;

    if (PGRSectionChildrenTypeEnum.PARAGRAPH == value) {
      return {
        type: PGRSectionChildrenTypeEnum.PARAGRAPH,
        text: splitSentence[0],
      };
    }

    if (PGRSectionChildrenTypeEnum.BULLET == value.split('-')[0]) {
      return {
        type: PGRSectionChildrenTypeEnum.BULLET,
        text: splitSentence[0],
        level: value.split('-')[1] || 0,
      };
    }
  }

  return {
    type: PGRSectionChildrenTypeEnum.PARAGRAPH,
    text: splitSentence[0],
  };
};

const environmentTypes = [
  {
    title: 'Visão Geral',
    type: CharacterizationTypeEnum.GENERAL,
    desc: 'Geral',
  },
  {
    title: 'Ambientes Administrativos',
    desc: 'Ambiente Administrativo',
    type: CharacterizationTypeEnum.ADMINISTRATIVE,
  },
  {
    title: 'Ambientes Operacionais',
    desc: 'Ambiente Operacional',
    type: CharacterizationTypeEnum.OPERATION,
  },
  { title: 'Ambiente de Apoio', type: CharacterizationTypeEnum.SUPPORT },
];

const characterizationTypes = [
  {
    title: 'Posto de Trabalho',
    desc: 'Posto de Trabalho',
    type: CharacterizationTypeEnum.WORKSTATION,
  },
  {
    title: 'Atividades',
    desc: 'Atividades',
    type: CharacterizationTypeEnum.ACTIVITIES,
  },
  {
    title: 'Equipamentos',
    desc: 'Equipamentos',
    type: CharacterizationTypeEnum.EQUIPMENT,
  },
];

export const allCharacterizationSections = (
  environmentsData: EnvironmentEntity[],
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  type = 'char' as 'env' | 'char',
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  const sections: (Paragraph | Table)[][] = [];

  (type === 'char' ? characterizationTypes : environmentTypes).forEach(
    ({ type, title: titleSection, desc }) => {
      const environments = environmentsData.filter(
        (e) => e.type === type || !!e.profileParentId,
      );
      if (!environments?.length) return;

      const sectionProfiles: Record<string, (Paragraph | Table)[]> = {};
      const environmentData = environmentsConverter(environments);
      environmentData
        .sort((a, b) => sortString(b, a, 'profileParentId'))
        .forEach(
          (
            {
              variables,
              elements,
              id,
              risks,
              considerations: cons,
              breakPage,
              activities: ac,
              profileParentId,
              profiles,
              type,
              paragraphs,
            },
            index,
          ) => {
            const title = [
              {
                type: PGRSectionChildrenTypeEnum.H3,
                text: `${desc}: ??${VariablesPGREnum.ENVIRONMENT_NAME}??`,
              },
            ] as ISectionChildrenType[];

            const otherSections = getData(
              hierarchiesTreeOrg,
              homoGroupTree,
              titleSection,
              convertToDocx,
              {
                variables,
                id,
                risks,
                considerations: cons,
                activities: ac,
                type,
                paragraphs,
              },
            );

            if (profileParentId) {
              otherSections.unshift(
                ...convertToDocx(
                  [
                    {
                      type: PGRSectionChildrenTypeEnum.PARAGRAPH,
                      text: ``,
                    },
                  ],
                  variables,
                ),
              );

              return (sectionProfiles[id] = otherSections);
            }

            const section = [
              ...convertToDocx([...title], variables),
              ...elements,
              ...otherSections,
              ...profiles
                .map((profile) => sectionProfiles[profile.id])
                .reduce((acc, curr) => (curr ? [...acc, ...curr] : acc), []),
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
            else {
              sections[sections.length - 1] = [
                ...(sections[sections.length - 1] || []),
                ...section,
              ];
            }
          },
        );
    },
  );

  return sections.map((section) => ({
    footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    children: section,
  }));
};
