import { UserEntity } from './../../../../../users/entities/user.entity';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { SignaturesConverter } from './signatures.converter';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { AlignmentType, Paragraph, Table } from 'docx';

export const signaturesIterable = (
  signatureEntity: (ProfessionalEntity | UserEntity)[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  if (!signatureEntity?.length) return [];

  const signaturesVariablesArray = SignaturesConverter(signatureEntity);

  const baseSection: ISectionChildrenType[] = [
    {
      type: PGRSectionChildrenTypeEnum.PARAGRAPH,
      text: '**Profissionais:**',
    },
  ];

  const iterableSections = signaturesVariablesArray
    .map((variables) => {
      let text = '';

      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_FORMATION]) text = `??${VariablesPGREnum.PROFESSIONAL_FORMATION}??\n`
      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_CREA]) text = `${text}CREA: ??${VariablesPGREnum.PROFESSIONAL_CREA}??\n`
      // eslint-disable-next-line prettier/prettier
      if (variables[VariablesPGREnum.PROFESSIONAL_CPF]) text = `${text}CPF: ${variables[VariablesPGREnum.PROFESSIONAL_CPF]}\n`
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
