import { ProfessionalSignatureModel } from '@/@v2/documents/domain/models/professional-signature.model';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { getCredential } from '../professionals/professionals.converter';

export const SignaturesConverter = (
  signatureEntity: ProfessionalSignatureModel[],
): IDocVariables[] => {
  return signatureEntity
    .filter((professional) => professional.isSigner)
    .map((signature) => {
      const crea = getCredential(signature);

      return {
        [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: signature.professionalCouncil.professional.certifications.join(' -- ') || '',
        [VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
        [VariablesPGREnum.PROFESSIONAL_FORMATION]: signature.professionalCouncil.professional.formation.join('/') || '',
        [VariablesPGREnum.PROFESSIONAL_NAME]: signature.professionalCouncil.professional.name || '',
        [VariablesPGREnum.PROFESSIONAL_CPF]: signature.professionalCouncil.professional.cpf || '',
      };
    });
};
