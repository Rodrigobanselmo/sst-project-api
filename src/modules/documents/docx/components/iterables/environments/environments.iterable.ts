import { AlignmentType, Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { environmentsConverter } from './environments.converter';

export const environmentIterable = (
  environments: EnvironmentEntity[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  if (!environments?.length) return [];

  const environmentData = environmentsConverter(environments);

  const iterableSections = environmentData
    .map(({ variables, elements, risks, considerations: cons }) => {
      const parameters: ISectionChildrenType[] = [];
      const riskFactors: ISectionChildrenType[] = [];
      const considerations: ISectionChildrenType[] = [];

      if (variables[VariablesPGREnum.ENVIRONMENT_NOISE]) {
        parameters.push({
          type: PGRSectionChildrenTypeEnum.BULLET,
          level: 0,
          text: `Ruído ambiente (Maior Valor Medido): ??${VariablesPGREnum.ENVIRONMENT_NOISE}?? db(A)`,
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

        // if (cons.length)
        //   parameters.push({
        //     type: PGRSectionChildrenTypeEnum.PARAGRAPH,
        //     text: '',
        //   });
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
            removeWithSomeEmptyVars: [VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
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

      return [
        ...convertToDocx(
          [
            {
              type: PGRSectionChildrenTypeEnum.BREAK,
            },
            {
              type: PGRSectionChildrenTypeEnum.H3,
              text: `??${VariablesPGREnum.ENVIRONMENT_NAME}??`,
            },
          ],
          variables,
        ),
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
            {
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: '',
            },
          ],
          variables,
        ),
      ];
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
