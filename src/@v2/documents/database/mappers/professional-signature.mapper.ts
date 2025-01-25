import { DocumentDataToProfessional, Professional, ProfessionalCouncil } from '@prisma/client';
import { ProfessionalCouncilModel } from '../../domain/models/professional-council.model';
import { ProfessionalSignatureModel } from '../../domain/models/professional-signature.model';
import { ProfessionalModel } from '../../domain/models/professional.model';

export type IProfessionalSignatureMapper = DocumentDataToProfessional & {
  professional: ProfessionalCouncil & {
    professional: Professional;
  };
};

export class ProfessionalSignatureMapper {
  static toModel(data: IProfessionalSignatureMapper): ProfessionalSignatureModel {
    return new ProfessionalSignatureModel({
      isElaborator: data.isElaborator,
      isSigner: data.isSigner,
      professional: new ProfessionalCouncilModel({
        id: data.professional.id,
        councilId: data.professional.councilId,
        councilType: data.professional.councilType,
        councilUF: data.professional.councilUF,
        professional: new ProfessionalModel({
          certifications: data.professional.professional.certifications,
          cpf: data.professional.professional.cpf || '00000000000',
          email: data.professional.professional.email || 'e-mail não informado',
          formation: data.professional.professional.formation,
          name: data.professional.professional.name || 'Nome não informado',
        }),
      }),
    });
  }

  static toModels(data: IProfessionalSignatureMapper[]): ProfessionalSignatureModel[] {
    return data.map((professionalSignature) => this.toModel(professionalSignature));
  }
}
