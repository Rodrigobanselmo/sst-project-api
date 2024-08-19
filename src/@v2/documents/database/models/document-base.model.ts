import { Company, DocumentData, DocumentDataToProfessional, DocumentModel, Professional, ProfessionalCouncil, Workspace } from '@prisma/client';
import { DocumentBaseEntity } from '../../domain/entities/document-base.entity';
import { DocumentTypeEnum } from '../../domain/enums/document-type.enum';
import { DocumentBaseDataVO } from '../../domain/values-object/document-base-data.vo';
import { DocumentModelEntity } from '../../domain/entities/document-model.entity';
import { WorkspaceEntity } from '../../domain/entities/workspace.entity';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { ProfessionalSignatureEntity } from '../../domain/entities/professional-signature.entity';
import { ProfessionalVO } from '../../domain/values-object/professional.vo';
import { ProfessionalCouncilEntity } from '../../domain/entities/professional-council.entity';

export type IDocumentBaseModel = DocumentData & {
  model: DocumentModel | null
  workspace: Workspace
  company: Company
  professionalsSignatures: (DocumentDataToProfessional & {
    professional: ProfessionalCouncil & {
      professional: Professional
    }
  })[]
}

export class DocumentBaseModel {
  static toEntity(data: IDocumentBaseModel): DocumentBaseEntity {
    const documentData = data.json as unknown as DocumentBaseDataVO | null;

    if (!data.model) {
      throw new Error('Modelo de documento não encontrado')
    }

    return new DocumentBaseEntity({
      ...data,
      name: data.name || '',
      type: data.type as DocumentTypeEnum,

      data: new DocumentBaseDataVO({
        isQ5: documentData?.isQ5 || false,
        hasEmergencyPlan: documentData?.hasEmergencyPlan || false,
        complementarySystems: documentData?.complementarySystems || [],
        source: documentData?.source,
        visitDate: documentData?.visitDate,
        months_period_level_2: documentData?.months_period_level_2 || 24,
        months_period_level_3: documentData?.months_period_level_3 || 12,
        months_period_level_4: documentData?.months_period_level_4 || 6,
        months_period_level_5: documentData?.months_period_level_5 || 3,
      }),
      model: new DocumentModelEntity({
        data: data.model.data,
        id: data.model.id,
        name: data.model.name,
        type: data.model.type as DocumentTypeEnum,
        description: data.model.description,
        system: data.model.system,
      }),
      workspace: new WorkspaceEntity({
        id: data.workspace.id,
        name: data.workspace.name,
      }),
      company: new CompanyEntity({
        id: data.company.id,
        name: data.company.name,
        cnpj: data.company.cnpj || '00000000000000',
      }),
      professionalSignatures: data.professionalsSignatures.map(professionalSignature => new ProfessionalSignatureEntity({
        isElaborator: professionalSignature.isElaborator,
        isSigner: professionalSignature.isSigner,
        professional: new ProfessionalCouncilEntity({
          id: professionalSignature.professional.id,
          councilId: professionalSignature.professional.councilId,
          councilType: professionalSignature.professional.councilType,
          councilUF: professionalSignature.professional.councilUF,
          professional: new ProfessionalVO({
            certifications: professionalSignature.professional.professional.certifications,
            cpf: professionalSignature.professional.professional.cpf || '00000000000',
            email: professionalSignature.professional.professional.email || 'e-mail não informado',
            formation: professionalSignature.professional.professional.formation,
            name: professionalSignature.professional.professional.name,
          }),
        }),
      })),
    })
  }


}
