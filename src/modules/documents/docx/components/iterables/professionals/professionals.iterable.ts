import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ProfessionalsConverter } from './professionals.converter';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { AlignmentType, Paragraph, Table } from 'docx';

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
      let text = '';

      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_FORMATION]) text = `??${VariablesPGREnum.PROFESSIONAL_FORMATION}??\n`
      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_CREA]) text = `${text}CREA: ??${VariablesPGREnum.PROFESSIONAL_CREA}??\n`
      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_NIT]) text = `${text}NIT(PIS/PASEP): ${variables[VariablesPGREnum.PROFESSIONAL_NIT]}\n`
      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]) text = `${text}${variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]}`
      return convertToDocx(
        [
          {
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: `**??${VariablesPGREnum.PROFESSIONAL_NAME}??**`,
          },
          {
            type: PGRSectionChildrenTypeEnum.PARAGRAPH,
            text,
            align: AlignmentType.START,
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
