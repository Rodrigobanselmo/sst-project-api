import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model'
import { Injectable } from '@nestjs/common'
import { DocumentVersionRepository } from '../../repositories/document-version/document-version.repository'
import { HierarchyDAO } from '../hierarchy/hierarchy.dao'
import { HomogeneousGroupDAO } from '../homogeneous-group/homogeneous-group.dao'
import { IDocumentDAO } from './document.types'
import { DocumentVersionDAO } from '../document-version/document-version.dao'


@Injectable()
export class DocumentDAO {
  constructor(
    private readonly homogeneousGroupDAO: HomogeneousGroupDAO,
    private readonly hierarchyDAO: HierarchyDAO,
    private readonly documentVersionDAO: DocumentVersionDAO,
  ) { }

  async findDocumentPGR(params: IDocumentDAO.FindByIdParams) {
    const document = await this.documentVersionDAO.findById({ id: params.documentVersionId })

    const workspaceId = document?.documentBase?.workspace.id
    if (!workspaceId) return null

    const [homogeneousGroups, hierarchies] = await Promise.all([
      this.homogeneousGroupDAO.findMany({ workspaceId }),
      this.hierarchyDAO.findMany({ workspaceId })
    ])

    return new DocumentPGRModel({
      documentVersion: document,
      homogeneousGroups,
      hierarchies
    })
  }


}
