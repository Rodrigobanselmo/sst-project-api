import { getNumOfEmployees } from "../functions/get-num-of-employees.func";
import { DocumentVersionModel } from "./document-version.model";
import { ExamModel } from "./exam.model";
import { HierarchyModel } from "./hierarchy.model";
import { HomogeneousGroupModel } from './homogeneous-group.model';
import { RiskDataExamModel } from "./risk-data-exam.model";
import { RiskDataModel } from "./risk-data.model";

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

  homogeneousGroupsMap: Record<string, HomogeneousGroupModel | null>
  hierarchiesMap: Record<string, HierarchyModel | null>
  examsMap: Record<string, ExamModel | null> = {}
  risksDataExamsMap: Record<string, RiskDataExamModel[] | null> = {}

  constructor(params: IDocumentPGRModel) {
    this.documentVersion = params.documentVersion;
    this.hierarchies = params.hierarchies
    this.homogeneousGroups = params.homogeneousGroups
    this.exams = params.exams

    this.homogeneousGroupsMap = this.getHomogeneousGroupsMap()
    this.hierarchiesMap = this.getHierarchiesMap()
    this.setExamsMap()
  }

  get documentBase() {
    return this.documentVersion.documentBase
  }

  get model() {
    return this.documentVersion.documentBase.model
  }

  get risksData() {
    return this.homogeneousGroups.reduce((acc, group) => [...acc, ...group.risksData({ documentType: 'isPGR' })], [] as RiskDataModel[])
  }

  get numOfEmployee() {
    return getNumOfEmployees(this.hierarchies)
  }

  getHierarchyGroups(hierarchy: HierarchyModel) {
    return hierarchy.groups.map((group) => this.homogeneousGroupsMap[group.homogeneousGroupId]).filter(Boolean) as HomogeneousGroupModel[]
  }

  getRiskDataExams(riskData: RiskDataModel) {
    const exams = [] as RiskDataExamModel[]

    riskData.exams.forEach((exam) => {
      const examModel = this.examsMap[exam.examId]
      if (examModel) exams.push(new RiskDataExamModel({
        exam: examModel,
        requirement: exam.requirement
      }))
    })

    const riskDataExams = this.risksDataExamsMap[riskData.risk.id]
    if (riskDataExams) exams.push(...riskDataExams)

    return exams
  }

  private getHomogeneousGroupsMap() {
    return this.homogeneousGroups.reduce((acc, group) => ({ ...acc, [group.id]: group }), {})
  }

  private getHierarchiesMap() {
    return this.hierarchies.reduce((acc, group) => ({ ...acc, [group.id]: group }), {})
  }

  private setExamsMap() {
    this.exams.forEach((exam) => {
      this.examsMap[exam.id] = exam

      exam.examRisks.forEach((examRisk) => {
        const riskId = examRisk.riskId
        if (!this.risksDataExamsMap[riskId]) this.risksDataExamsMap[riskId] = []
        this.risksDataExamsMap[riskId].push(new RiskDataExamModel({
          exam,
          requirement: examRisk.requirement
        }))
      })
    })
  }
}
