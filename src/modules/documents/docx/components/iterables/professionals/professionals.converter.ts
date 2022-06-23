import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

export const ProfessionalsConverter = (
  professionalEntity: ProfessionalEntity[],
): IDocVariables[] => {
  return professionalEntity.map((professional) => ({
    [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]:
      professional.certifications.join(' -- ') || '',
    [VariablesPGREnum.PROFESSIONAL_CREA]: professional.crea || '',
    [VariablesPGREnum.PROFESSIONAL_FORMATION]:
      professional.formation.join('/') || '',
    [VariablesPGREnum.PROFESSIONAL_NAME]: professional.name || '',
    [VariablesPGREnum.PROFESSIONAL_NIT]: professional.nit || '',
  }));
};
