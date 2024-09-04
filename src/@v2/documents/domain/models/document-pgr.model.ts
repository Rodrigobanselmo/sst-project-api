import { DocumentVersionModel } from "./document-version.model";
import { ExamModel } from "./exam.model";
import { HierarchyModel } from "./hierarchy.model";
import { HomogeneousGroupModel } from './homogeneous-group.model';

export type IDocumentPGRModel = {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]
  exams: ExamModel[]
}

export class DocumentPGRModel {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]
  exams: ExamModel[]

  homogeneousGroupsMap: Record<string, HomogeneousGroupModel>
  hierarchiesMap: Record<string, HierarchyModel>

  constructor(params: IDocumentPGRModel) {
    this.documentVersion = params.documentVersion;
    this.hierarchies = params.hierarchies
    this.homogeneousGroups = params.homogeneousGroups
    this.exams = params.exams

    this.homogeneousGroupsMap = this.getHomogeneousGroupsMap()
    this.hierarchiesMap = this.getHierarchiesMap()
  }

  get documentBase() {
    return this.documentVersion.documentBase
  }

  get model() {
    return this.documentVersion.documentBase.model
  }

  getHierarchyGroups(hierarchy: HierarchyModel) {
    return hierarchy.groups.map((group) => this.homogeneousGroupsMap[group.homogeneousGroupId])
  }

  private getHomogeneousGroupsMap() {
    return this.homogeneousGroups.reduce((acc, group) => ({ ...acc, [group.id]: group }), {})
  }

  private getHierarchiesMap() {
    return this.hierarchies.reduce((acc, group) => ({ ...acc, [group.id]: group }), {})
  }
}
