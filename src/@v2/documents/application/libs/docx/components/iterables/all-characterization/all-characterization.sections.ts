import { CharacterizationTypeEnum } from '@prisma/client';
import { AlignmentType, BorderStyle, Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocVariables } from '../../../builders/pgr/types/IDocumentPGRSectionGroups';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { hierarchyHomoOrgTable } from '../../tables/hierarchyHomoOrg/hierarchyHomoOrg.table';
import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { environmentsConverter, IEnvironmentConvertResponse } from './all-characterization.converter';
import { sortNumber } from '../../../../../../shared/utils/sorts/number.sort';
import { getCharacterizationType } from '../../../../../../shared/utils/getCharacterizationType';
import { filterRisk } from '../../../../../../shared/utils/filterRisk';

const getData = (
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  titleSection: string,
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
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
      type: DocumentSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Ruído ambiente (Maior Valor Medido): ??${VariablesPGREnum.ENVIRONMENT_NOISE}?? dB(A)`,
    });
  }

  if (variables[VariablesPGREnum.ENVIRONMENT_TEMPERATURE]) {
    parameters.push({
      type: DocumentSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Temperatura do ar: ??${VariablesPGREnum.ENVIRONMENT_TEMPERATURE}?? ºC`,
    });
  }

  if (variables[VariablesPGREnum.ENVIRONMENT_MOISTURE]) {
    parameters.push({
      type: DocumentSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Umidade do ar: ??${VariablesPGREnum.ENVIRONMENT_MOISTURE}??%`,
    });
  }

  if (variables[VariablesPGREnum.ENVIRONMENT_LUMINOSITY]) {
    parameters.push({
      type: DocumentSectionChildrenTypeEnum.BULLET,
      level: 0,
      text: `Iluminância: ??${VariablesPGREnum.ENVIRONMENT_LUMINOSITY}?? LUX`,
    });
  }

  if (parameters.length) {
    parameters.unshift({
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
      text: '**Parâmetros ambientais:**',
      spacing: { after: 100 },
    });
  }

  risks
    .filter((risk) => filterRisk(risk))
    .forEach((risk, index) => {
      if (index === 0)
        riskFactors.push({
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Fatores de risco:**',
          spacing: { after: 100 },
        });

      riskFactors.push({
        type: DocumentSectionChildrenTypeEnum.BULLET,
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
        type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
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
        type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
        text: '**Descrição das Atividades:**',
        spacing: { after: 100 },
      });

    activities.push({
      ...getSentenceType(activity),
    });
  });

  const ProfileTitle = [
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
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

  const { table: officesTable, missingBody } = hierarchyHomoOrgTable(hierarchiesTreeOrg, homoGroupTree, {
    showDescription: false,
    showHomogeneous: true,
    type: getCharacterizationType(type),
    groupIdFilter: id,
  });

  if (!missingBody) {
    const titleTable = [
      {
        type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
        text: `Cargos lotados no ${titleSection} ??${VariablesPGREnum.CHARACTERIZATION_NAME}??`,
      },
    ] as ISectionChildrenType[];

    offices.push(...convertToDocx(titleTable, variables));
    offices.push(officesTable);
  }

  const section = [
    ...convertToDocx([...ProfileTitle], variables),
    ...convertToDocx(
      [
        {
          type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
          text: `??${VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
          alignment: AlignmentType.START,
          removeWithSomeEmptyVars: [VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
        },
        ...paragraphSection,
        ...riskFactors,
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

    if (DocumentSectionChildrenTypeEnum.PARAGRAPH == value) {
      return {
        type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
        text: splitSentence[0],
      };
    }

    if (DocumentSectionChildrenTypeEnum.BULLET == value.split('-')[0]) {
      return {
        type: DocumentSectionChildrenTypeEnum.BULLET,
        text: splitSentence[0],
        level: value.split('-')[1] || 0,
      };
    }
  }

  return {
    type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
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
  {
    title: 'Ambiente de Apoio',
    desc: 'Ambiente de Apoio',
    type: CharacterizationTypeEnum.SUPPORT,
  },
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
  environmentsData: CharacterizationEntity[],
  hierarchiesTreeOrg: IHierarchyData,
  homoGroupTree: IHomoGroupMap,
  type = 'char' as 'env' | 'char',
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const sections: (Paragraph | Table)[][] = [];
  const sectionProfiles: Record<string, (Paragraph | Table)[]> = {};

  (type === 'char' ? characterizationTypes : environmentTypes).forEach(({ type, title: titleSection, desc }) => {
    const environments = environmentsData.filter((e) => e.type === type || !!e.profileParentId);

    if (!environments?.length) return;

    const environmentData = environmentsConverter(environments);
    let firstPass = true;

    environmentData
      .sort((a, b) => sortNumber(b.profileParentId ? 1 : 0, a.profileParentId ? 1 : 0))
      .forEach(
        ({
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
        }) => {
          const title = [
            {
              type: DocumentSectionChildrenTypeEnum.H3,
              text: `${desc}: ??${VariablesPGREnum.ENVIRONMENT_NAME}??`,
            },
          ] as ISectionChildrenType[];

          const otherSections = getData(hierarchiesTreeOrg, homoGroupTree, titleSection, convertToDocx, {
            variables,
            id,
            risks,
            considerations: cons,
            activities: ac,
            type,
            paragraphs,
          });

          if (profileParentId) {
            otherSections.unshift(
              ...convertToDocx(
                [
                  {
                    type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
                    text: ``,
                  },
                ],
                variables,
              ),
            );

            sectionProfiles[id] = otherSections;
            return;
          }

          const section = [
            ...convertToDocx([...title], variables),
            ...elements,
            ...otherSections,
            ...profiles
              .map((profile) => sectionProfiles[profile.id])
              .reduce((acc, curr) => (curr ? [...acc, ...curr] : acc), []),
          ];

          if (firstPass) {
            section.unshift(
              ...convertToDocx([
                {
                  type: DocumentSectionChildrenTypeEnum.H2,
                  text: titleSection,
                },
              ]),
            );
            firstPass = false;
          }

          if (breakPage || sections.length === 0) sections.push(section);
          else {
            sections[sections.length - 1] = [...(sections[sections.length - 1] || []), ...section];
          }
        },
      );
  });

  return sections.map((section) => ({
    footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    children: section,
  }));
};
