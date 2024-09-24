import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model'
import { Injectable } from '@nestjs/common'
import { HierarchyDAO } from '../hierarchy/hierarchy.dao'
import { HomogeneousGroupDAO } from '../homogeneous-group/homogeneous-group.dao'
import { IDocumentDAO } from './document.types'
import { DocumentVersionDAO } from '../document-version/document-version.dao'
import { ExamDAO } from '../exam/exam.dao'


@Injectable()
export class DocumentDAO {
  constructor(
    private readonly homogeneousGroupDAO: HomogeneousGroupDAO,
    private readonly hierarchyDAO: HierarchyDAO,
    private readonly examDAO: ExamDAO,
    private readonly documentVersionDAO: DocumentVersionDAO,
  ) { }

  async findDocumentPGR(params: IDocumentDAO.FindByIdParams) {
    const document = await this.documentVersionDAO.find({ id: params.documentVersionId })

    const workspaceId = document?.documentBase?.workspace.id
    if (!workspaceId) return null

    const [homogeneousGroups, hierarchies, exams] = await Promise.all([
      this.homogeneousGroupDAO.findMany({ workspaceId, companyId: document.documentBase.company.id }),
      this.hierarchyDAO.findMany({ workspaceId }),
      this.examDAO.findMany({ companyId: document.documentBase.company.id }),
    ])

    return new DocumentPGRModel({
      documentVersion: document,
      homogeneousGroups,
      exams,
      hierarchies
    })
  }


}
