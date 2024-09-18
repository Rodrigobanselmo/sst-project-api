import { DocumentData, DocumentModel, RiskFactorDocument } from '@prisma/client';
import { DocumentTypeEnum } from '../../../shared/domain/enum/documents/document-type.enum';
import { DocumentBaseModel } from '../../domain/models/document-base.model';
import { DocumentModelModel } from '../../domain/models/document-model.model';
import { CompanyMapper, ICompanyMapper } from './company.mapper';
import { DocumentBaseDataMapper } from './document-base-data.mapper';
import { IProfessionalSignatureMapper, ProfessionalSignatureMapper } from './professional-signature.mapper';
import { IWorkspaceMapper, WorkspaceMapper } from './workspace.mapper';
import { VersionModel } from '../../domain/models/version.model';

export type IDocumentBaseMapper = DocumentData & {
  model: DocumentModel | null
  workspace: IWorkspaceMapper
  company: ICompanyMapper
  docs: RiskFactorDocument[]
  professionalsSignatures: IProfessionalSignatureMapper[]
}

export class DocumentBaseMapper {
  static toModel(data: IDocumentBaseMapper): DocumentBaseModel {
    if (!data.model) {
      throw new Error('Modelo de documento não encontrado')
    }

    return new DocumentBaseModel({
      ...data,
      name: data.name || '',
      type: data.type as DocumentTypeEnum,
      data: DocumentBaseDataMapper.toVO(data),
      model: new DocumentModelModel({ data: data.model.data }),
      workspace: WorkspaceMapper.toModel(data.workspace),
      company: CompanyMapper.toModel(data.company),
      professionalSignatures: ProfessionalSignatureMapper.toModels(data.professionalsSignatures),
      versions: data.docs.map(doc => new VersionModel({
        createdAt: doc.created_at,
        description: doc.description,
        approvedBy: doc.approvedBy,
        elaboratedBy: doc.elaboratedBy,
        revisionBy: doc.revisionBy,
        version: doc.version
      }))
    })
  }


}
