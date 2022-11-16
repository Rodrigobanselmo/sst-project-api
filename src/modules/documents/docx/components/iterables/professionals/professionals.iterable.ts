import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

import { ISectionChildrenType, PGRSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ProfessionalsConverter } from './professionals.converter';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { AlignmentType, Paragraph, Table } from 'docx';

export const professionalsIterable = (
  professionalEntity: (ProfessionalEntity | UserEntity)[],
  workspace: WorkspaceEntity,
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  if (!professionalEntity?.length) return [];

  const professionalsVariablesArray = ProfessionalsConverter(professionalEntity, workspace);

  const baseSection: ISectionChildrenType[] = [
    {
      type: PGRSectionChildrenTypeEnum.PARAGRAPH,
      text: '**Profissionais:**',
    },
  ];

  const iterableSections = professionalsVariablesArray
    .map((variables) => {
      let text = '';

      if (variables[VariablesPGREnum.PROFESSIONAL_FORMATION]) text = `??${VariablesPGREnum.PROFESSIONAL_FORMATION}??\n`;

      if (variables[VariablesPGREnum.PROFESSIONAL_CREA]) text = `${text}??${VariablesPGREnum.PROFESSIONAL_CREA}??\n`;

      if (variables[VariablesPGREnum.PROFESSIONAL_CPF]) text = `${text}CPF: ${variables[VariablesPGREnum.PROFESSIONAL_CPF]}\n`;

      if (variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]) text = `${text}${variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]}`;
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
