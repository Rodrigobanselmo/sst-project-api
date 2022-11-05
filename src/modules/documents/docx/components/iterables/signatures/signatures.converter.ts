import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';
import { getCredential } from '../professionals/professionals.converter';

export const SignaturesConverter = (
  signatureEntity: (ProfessionalEntity | UserEntity)[],
  workspace: WorkspaceEntity,
): IDocVariables[] => {
  return signatureEntity
    .filter((professional) =>
      'professionalPgrSignature' in professional
        ? professional.professionalPgrSignature.isSigner
        : 'professionalPgrSignature' in professional
        ? professional.professionalPgrSignature.isSigner
        : false,
    )
    .map((signature) => {
      // const council =
      //   signature?.councils?.find(
      //     (c) =>
      //       c.councilType === 'CREA' &&
      //       c.councilUF === workspace?.address?.state,
      //   ) || signature?.councils?.[0];

      const crea = getCredential(signature as ProfessionalEntity);

      return {
        [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]:
          signature.certifications.join(' -- ') || '',
        [VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
        [VariablesPGREnum.PROFESSIONAL_FORMATION]:
          signature.formation.join('/') || '',
        [VariablesPGREnum.PROFESSIONAL_NAME]: signature.name || '',
        [VariablesPGREnum.PROFESSIONAL_CPF]: signature.cpf || '',
      };
    });
};
