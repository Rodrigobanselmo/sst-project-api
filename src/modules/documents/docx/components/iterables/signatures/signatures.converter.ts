import { UserEntity } from './../../../../../users/entities/user.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

export const SignaturesConverter = (
  signatureEntity: (ProfessionalEntity | UserEntity)[],
): IDocVariables[] => {
  return signatureEntity
    .filter((user) => user.userPgrSignature.isSigner)
    .map((signature) => ({
      [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]:
        signature.certifications.join(' -- ') || '',
      [VariablesPGREnum.PROFESSIONAL_CREA]: signature.crea || '',
      [VariablesPGREnum.PROFESSIONAL_FORMATION]:
        signature.formation.join('/') || '',
      [VariablesPGREnum.PROFESSIONAL_NAME]: signature.name || '',
      [VariablesPGREnum.PROFESSIONAL_CPF]: signature.cpf || '',
    }));
};
