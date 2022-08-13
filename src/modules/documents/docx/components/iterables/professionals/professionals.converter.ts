import { UserEntity } from './../../../../../users/entities/user.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

export const getCredential = (row: ProfessionalEntity | UserEntity) => {
  if ('councilId' in row) {
    return `${row?.councilType ? row.councilType + ' :' : ''}${row.councilId}${
      row?.councilUF ? ' - ' + row.councilUF : ''
    }`;
  }
};

export const ProfessionalsConverter = (
  professionalEntity: (ProfessionalEntity | UserEntity)[],
): IDocVariables[] => {
  return professionalEntity
    .filter((professional) =>
      'professionalPgrSignature' in professional
        ? professional.professionalPgrSignature.isElaborator
        : 'professionalPgrSignature' in professional
        ? professional.professionalPgrSignature.isElaborator
        : false,
    )
    .map((professional) => {
      const crea =
        professional?.councilType === 'CREA' ? getCredential(professional) : '';

      return {
        [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]:
          professional.certifications.join(' -- ') || '',
        [VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
        [VariablesPGREnum.PROFESSIONAL_FORMATION]:
          professional.formation.join('/') || '',
        [VariablesPGREnum.PROFESSIONAL_NAME]: professional.name || '',
        [VariablesPGREnum.PROFESSIONAL_CPF]: professional.cpf || '',
      };
    });
};
