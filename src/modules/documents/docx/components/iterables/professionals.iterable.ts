import { ProfessionalEntity } from './../../../../users/entities/professional.entity';

import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../builders/pgr/types/elements.types';
import { VariablesPGREnum } from '../../builders/pgr/enums/variables.enum';
import { ProfessionalsConverter } from './professionals.converter';
import { IDocVariables } from '../../builders/pgr/types/section.types';
import { Paragraph, Table } from 'docx';

export const professionalsIterable = (
  professionalEntity: ProfessionalEntity[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  if (!professionalEntity?.length) return [];

  const professionalsVariablesArray =
    ProfessionalsConverter(professionalEntity);

  const baseSection: ISectionChildrenType[] = [
    {
      type: PGRSectionChildrenTypeEnum.PARAGRAPH,
      text: '**Profissionais:**',
    },
  ];

  const iterableSections = professionalsVariablesArray
    .map((variables) => {
      return convertToDocx(
        [
          {
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: '',
          },
          {
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: `**${VariablesPGREnum.PROFESSIONAL_NAME}**`,
          },
          {
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: `${VariablesPGREnum.PROFESSIONAL_FORMATION}\n${VariablesPGREnum.PROFESSIONAL_CREA}\n${VariablesPGREnum.PROFESSIONAL_NIT}\n${VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS}}`,
          },
        ],
        variables,
      );
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return [...convertToDocx(baseSection), ...iterableSections];
};
