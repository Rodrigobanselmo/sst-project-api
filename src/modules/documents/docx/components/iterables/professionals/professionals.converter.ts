import { ProfessionalCouncilEntity } from './../../../../../users/entities/council.entity';
import { WorkspaceEntity } from './../../../../../company/entities/workspace.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { UserEntity } from './../../../../../users/entities/user.entity';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { ProfessionalEntity } from '../../../../../users/entities/professional.entity';

export const getCredential = (row: ProfessionalEntity) => {
  if (row && 'councilId' in row) {
    return `${row?.councilType ? row.councilType + ': ' : ''}${row.councilId}${row?.councilUF ? ' - ' + row.councilUF : ''}`;
  }
  return '';
};

export const ProfessionalsConverter = (professionalEntity: ProfessionalEntity[], workspace: WorkspaceEntity): IDocVariables[] => {
  return professionalEntity
    .filter((professional) =>
      'professionalDocumentDataSignature' in professional
        ? professional.professionalDocumentDataSignature.isElaborator
        : 'professionalDocumentDataSignature' in professional
        ? professional.professionalDocumentDataSignature.isElaborator
        : false,
    )
    .map((professional) => {
      // const council =professional
      //   professional?.councils?.find(
      //     (c) =>
      //       c.councilType === 'CREA' &&
      //       c.councilUF === workspace?.address?.state,
      //   ) || professional?.councils?.[0];

      const crea = getCredential(professional as ProfessionalEntity);

      return {
        [VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: professional.certifications.join(' -- ') || '',
        [VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
        [VariablesPGREnum.PROFESSIONAL_FORMATION]: professional.formation.join('/') || '',
        [VariablesPGREnum.PROFESSIONAL_NAME]: professional.name || '',
        [VariablesPGREnum.PROFESSIONAL_CPF]: professional.cpf || '',
      };
    });
};
