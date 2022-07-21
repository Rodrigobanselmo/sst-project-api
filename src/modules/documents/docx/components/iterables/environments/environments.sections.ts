import { CompanyEnvironmentTypesEnum } from '@prisma/client';
import { AlignmentType, Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { environmentsConverter } from './environments.converter';

export const environmentSections = (
  environmentsData: EnvironmentEntity[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  const sections: (Paragraph | Table)[][] = [];

  [
    {
      title: 'Visão Geral',
      type: CompanyEnvironmentTypesEnum.GENERAL,
      desc: 'Geral',
    },
    {
      title: 'Ambientes Administrativos',
      desc: 'Ambiente Administrativo',
      type: CompanyEnvironmentTypesEnum.ADMINISTRATIVE,
    },
    {
      title: 'Ambientes Operacionais',
      desc: 'Ambiente Operacional',
      type: CompanyEnvironmentTypesEnum.OPERATION,
    },
    { title: 'Ambiente de Apoio', type: CompanyEnvironmentTypesEnum.SUPPORT },
  ].forEach(({ type, title: titleSection, desc }) => {
    const environments = environmentsData.filter((e) => e.type === type);
    if (!environments?.length) return;

    const environmentData = environmentsConverter(environments);
    console.log(environmentData);
    environmentData.forEach(
      (
        { variables, elements, risks, considerations: cons, breakPage },
        index,
        arr,
      ) => {
        const parameters: ISectionChildrenType[] = [];
        const riskFactors: ISectionChildrenType[] = [];
        const considerations: ISectionChildrenType[] = [];

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
            text: `Umidade do ar: ??${VariablesPGREnum.ENVIRONMENT_LUMINOSITY}??%`,
          });
        }

        if (parameters.length) {
          parameters.unshift({
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: '**Parâmetros ambientais:**',
          });
        }

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
              removeWithSomeEmptyVars: [
                VariablesPGREnum.ENVIRONMENT_DESCRIPTION,
              ],
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
            text: `${desc}: ??${VariablesPGREnum.ENVIRONMENT_NAME}??`,
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
                text: `??${VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
                alignment: AlignmentType.START,
                removeWithSomeEmptyVars: [
                  VariablesPGREnum.ENVIRONMENT_DESCRIPTION,
                ],
              },
              ...parameters,
              ...considerations,
            ],
            variables,
          ),
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
  });

  return sections.map((section) => ({
    footerText: `??${VariablesPGREnum.CHAPTER_2}??`,
    children: section,
  }));
};
