import { DocumentVersionModel } from "./document-version.model";
import { HierarchyModel } from "./hierarchy.model";
import { HomogeneousGroupModel } from './homogeneous-group.model';

export type IDocumentPGRModel = {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]
}

export class DocumentPGRModel {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]

  constructor(params: IDocumentPGRModel) {
    this.documentVersion = params.documentVersion;
    this.hierarchies = params.hierarchies
    this.homogeneousGroups = params.homogeneousGroups
  }

  get documentBase() {
    return this.documentVersion.documentBase
  }

  get model() {
    return this.documentVersion.documentBase.model
  }

}
