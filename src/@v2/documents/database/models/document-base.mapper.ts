import { DocumentData, DocumentModel } from '@prisma/client';
import { DocumentTypeEnum } from '../../domain/enums/document-type.enum';
import { DocumentBaseModel } from '../../domain/models/document-base.model';
import { DocumentModelModel } from '../../domain/models/document-model.model';
import { CompanyMapper, ICompanyMapper } from './company.mapper';
import { DocumentBaseDataMapper } from './document-base-data.mapper';
import { IProfessionalSignatureMapper, ProfessionalSignatureMapper } from './professional-signature.mapper';
import { IWorkspaceMapper, WorkspaceMapper } from './workspace.mapper';

export type IDocumentBaseMapper = DocumentData & {
  model: DocumentModel | null
  workspace: IWorkspaceMapper
  company: ICompanyMapper
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
      professionalSignatures: ProfessionalSignatureMapper.toModels(data.professionalsSignatures)
    })
  }


}
