import { Paragraph, Table } from 'docx';

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
    .map(({ variables, elements }) => {
      const parameters: ISectionChildrenType[] = [];

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
          text: `Umidade do ar: ??${VariablesPGREnum.ENVIRONMENT_TEMPERATURE}??%`,
        });
      }

      if (parameters.length)
        parameters.unshift({
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Parâmetros ambientais:',
        });

      return [
        ...convertToDocx(
          [
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
            {
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: `??${VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
            },
            ...parameters,
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
