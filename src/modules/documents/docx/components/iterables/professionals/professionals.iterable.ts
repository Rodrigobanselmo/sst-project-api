import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

import { ISectionChildrenType, DocumentSectionChildrenTypeEnum } from '../../../builders/pgr/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ProfessionalsConverter } from './professionals.converter';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { AlignmentType, Paragraph, Table } from 'docx';

export const professionalsIterable = (
  professionalEntity: ProfessionalEntity[],
  workspace: WorkspaceEntity,
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  if (!professionalEntity?.length) return [];

  const professionalsVariablesArray = ProfessionalsConverter(professionalEntity, workspace);

  const baseSection: ISectionChildrenType[] = [
    {
      type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
      text: '**Profissionais:**',
    },
  ];

  const iterableSections = professionalsVariablesArray
    .map((variables) => {
      let text = '';

      if (variables[VariablesPGREnum.PROFESSIONAL_FORMATION]) text = `??${VariablesPGREnum.PROFESSIONAL_FORMATION}??\n`;

      if (variables[VariablesPGREnum.PROFESSIONAL_CREA]) text = `${text}??${VariablesPGREnum.PROFESSIONAL_CREA}??\n`;

      if (variables[VariablesPGREnum.PROFESSIONAL_CPF])
        text = `${text}CPF: ${variables[VariablesPGREnum.PROFESSIONAL_CPF]}\n`;

      if (variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS])
        text = `${text}${variables[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]}`;
      return convertToDocx(
        [
          {
            type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
            text: `**??${VariablesPGREnum.PROFESSIONAL_NAME}??**`,
          },
          {
            type: DocumentSectionChildrenTypeEnum.PARAGRAPH,
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
