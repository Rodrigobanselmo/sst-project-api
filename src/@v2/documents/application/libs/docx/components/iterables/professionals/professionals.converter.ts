
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/IDocumentPGRSectionGroups';
import { ProfessionalSignatureModel } from '@/@v2/documents/domain/models/professional-signature.model';

export const getCredential = (row: ProfessionalSignatureModel) => {
  if (row.professionalCouncil.councilId) {
    return `${row.professionalCouncil?.councilType ? row.professionalCouncil.councilType + ': ' : ''}${row.professionalCouncil.councilId}${row.professionalCouncil?.councilUF ? ' - ' + row.professionalCouncil.councilUF : ''}`;
  }
  return '';
};

export const ProfessionalsConverter = (
  professionalEntity: ProfessionalSignatureModel[],
): IDocVariables[] => {
  return professionalEntity
    .filter((professional) => professional.isElaborator)
    .map((professional) => {
      const crea = getCredential(professional);

      return {
        [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: professional.professionalCouncil.professional.certifications.join(' -- ') || '',
        [VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
        [VariablesPGREnum.PROFESSIONAL_FORMATION]: professional.professionalCouncil.professional.formation.join('/') || '',
        [VariablesPGREnum.PROFESSIONAL_NAME]: professional.professionalCouncil.professional.name || '',
        [VariablesPGREnum.PROFESSIONAL_CPF]: professional.professionalCouncil.professional.cpf || '',
      };
    });
};
