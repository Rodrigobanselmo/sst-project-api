import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { AlignmentType, Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { characterizationsConverter } from './characterization.converter';

export const characterizationIterable = (
  characterizations: CharacterizationEntity[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  if (!characterizations?.length) return [];

  const characterizationData = characterizationsConverter(characterizations);

  const iterableSections = characterizationData
    .map(({ variables, elements, risks, considerations: cons, breakPage }) => {
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
          alignment: AlignmentType.START,
        });
      });

      const title = [
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: `??${VariablesPGREnum.CHARACTERIZATION_NAME}??`,
        },
      ] as ISectionChildrenType[];

      if (breakPage) title.unshift({ type: PGRSectionChildrenTypeEnum.BREAK });

      return [
        ...convertToDocx([...title], variables),
        ...elements,
        ...convertToDocx(
          [
            ...riskFactors,
            {
              type: PGRSectionChildrenTypeEnum.PARAGRAPH,
              text: `??${VariablesPGREnum.CHARACTERIZATION_DESC}??`,
              alignment: AlignmentType.START,
              removeWithSomeEmptyVars: [VariablesPGREnum.CHARACTERIZATION_DESC],
            },
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
