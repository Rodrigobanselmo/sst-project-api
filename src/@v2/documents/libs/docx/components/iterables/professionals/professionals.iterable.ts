import { DocumentChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { ProfessionalSignatureModel } from '@/@v2/documents/domain/models/professional-signature.model';
import { AlignmentType, Paragraph, Table } from 'docx';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { ProfessionalsConverter } from './professionals.converter';

export const professionalsIterable = (professionalEntity: ProfessionalSignatureModel[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
  if (!professionalEntity?.length) return [];

  const professionalsVariablesArray = ProfessionalsConverter(professionalEntity);

  const baseSection: ISectionChildrenType[] = [
    {
      type: DocumentChildrenTypeEnum.PARAGRAPH,
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
            type: DocumentChildrenTypeEnum.PARAGRAPH,
            text: `**??${VariablesPGREnum.PROFESSIONAL_NAME}??**`,
          },
          {
            type: DocumentChildrenTypeEnum.PARAGRAPH,
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
