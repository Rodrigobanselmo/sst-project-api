import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { getNumOfEmployees } from '../functions/get-num-of-employees.func';
import { DocumentVersionModel } from './document-version.model';
import { ExamModel } from './exam.model';
import { HierarchyModel } from './hierarchy.model';
import { HomogeneousGroupModel } from './homogeneous-group.model';
import { RiskDataExamModel } from './risk-data-exam.model';
import { RiskDataModel } from './risk-data.model';
import { EPIModel } from './epis.model';
import { AdministrativeMeasureModel } from './administrative-measure.model';
import { EngineeringMeasureModel } from './engineering-measure.model';

export type IDocumentPGRModel = {
  documentVersion: DocumentVersionModel;
  hierarchies: HierarchyModel[];
  homogeneousGroups: HomogeneousGroupModel[];
  exams: ExamModel[];
};

export class DocumentPGRModel {
  documentVersion: DocumentVersionModel;
  hierarchies: HierarchyModel[];
  homogeneousGroups: HomogeneousGroupModel[];
  exams: ExamModel[];

  homogeneousGroupsMap: Record<string, HomogeneousGroupModel | null>;
  hierarchiesMap: Record<string, HierarchyModel | null>;
  examsMap: Record<string, ExamModel | null> = {};
  risksDataExamsMap: Record<string, RiskDataExamModel[] | null> = {};

  constructor(params: IDocumentPGRModel) {
    this.documentVersion = params.documentVersion;
    this.hierarchies = params.hierarchies;
    this.homogeneousGroups = params.homogeneousGroups;
    this.exams = params.exams;

    this.homogeneousGroupsMap = this.getHomogeneousGroupsMap();
    this.hierarchiesMap = this.getHierarchiesMap(this.hierarchies);
    this.filterHierarchyGroups();
    this.setExamsMap();
  }

  get documentBase() {
    return this.documentVersion.documentBase;
  }

  get model() {
    return this.documentVersion.documentBase.model;
  }

  get risksData() {
    return this.homogeneousGroups.reduce((acc, group) => [...acc, ...group.risksData({ documentType: 'isPGR' })], [] as RiskDataModel[]);
  }

  get engineeringMeasures() {
    const map = new Map<string, EngineeringMeasureModel>();
    this.risksData.forEach((riskData) => {
      riskData.engineeringMeasures.forEach((measure) => map.set(measure.name, measure));
    });

    return Array.from(map.values());
  }

  get administrativeMeasures() {
    const map = new Map<string, AdministrativeMeasureModel>();
    this.risksData.forEach((riskData) => {
      riskData.administrativeMeasures.forEach((measure) => map.set(measure.name, measure));
    });

    return Array.from(map.values());
  }

  get epis() {
    const map = new Map<string, EPIModel>();
    this.risksData.forEach((riskData) => {
      riskData.epis.forEach((epi) => map.set(epi.name, epi));
    });

    return Array.from(map.values());
  }

  get numOfEmployee() {
    return getNumOfEmployees(this.hierarchies);
  }

  getHomogeneousGroupsByHierarchy(hierarchy: HierarchyModel) {
    return hierarchy.groups.map((group) => this.homogeneousGroupsMap[group.homogeneousGroupId]).filter(Boolean) as HomogeneousGroupModel[];
  }

  getExamsByRiskData(riskData: RiskDataModel) {
    const exams = [] as RiskDataExamModel[];

    riskData.exams.forEach((exam) => {
      const examModel = this.examsMap[exam.examId];
      if (examModel)
        exams.push(
          new RiskDataExamModel({
            exam: examModel,
            requirement: exam.requirement,
          }),
        );
    });

    const riskDataExams = this.risksDataExamsMap[riskData.risk.id];
    if (riskDataExams) exams.push(...riskDataExams);

    return exams;
  }

  getHierarchyNestedChildren(hierarchy: HierarchyModel) {
    const children = [];

    const findChildrenRecursively = (currentParentId: string) => {
      for (const item of this.hierarchies) {
        if (item.parentId === currentParentId) {
          children.push(item);
          findChildrenRecursively(item.id);
        }
      }
    };

    findChildrenRecursively(hierarchy.id);
    return children;
  }

  getHierarchiesByType(type: HierarchyTypeEnum) {
    return this.hierarchies.filter((hierarchy) => hierarchy.type === type);
  }

  getModifiedHomogeneousGroupsByHierarchies(hierarchies: HierarchyModel[]) {
    const hierarchiesMap = this.getHierarchiesMap(hierarchies);
    const homogeneousGroups = [] as HomogeneousGroupModel[];

    this.homogeneousGroups.forEach((homogeneousGroup) => {
      homogeneousGroup.hierarchies.some((hierarchy) => {
        const found = hierarchiesMap[hierarchy.hierarchyId];
        if (found) {
          homogeneousGroups.push(
            new HomogeneousGroupModel({
              ...homogeneousGroup,
              risksData: homogeneousGroup._risksData,
              hierarchies: homogeneousGroup.hierarchies.filter((hierarchy) => hierarchiesMap[hierarchy.hierarchyId]),
            }),
          );
          return true;
        }
      });
    });

    return homogeneousGroups;
  }

  getModifiedEntityFilteredByHierarchy(hierarchy: HierarchyModel) {
    const hierarchies = [hierarchy, ...this.getHierarchyNestedChildren(hierarchy)];

    return new DocumentPGRModel({
      hierarchies: hierarchies,
      documentVersion: this.documentVersion,
      homogeneousGroups: this.getModifiedHomogeneousGroupsByHierarchies(hierarchies),
      exams: this.exams,
    });
  }

  getHierarchyParents(hierarchy: HierarchyModel) {
    const parents = [] as HierarchyModel[];

    const findParentsRecursively = (currentParentId: string) => {
      const parent = this.hierarchies.find((item) => item.id === currentParentId);
      if (parent) {
        parents.unshift(parent);
        findParentsRecursively(parent.parentId);
      }
    };

    findParentsRecursively(hierarchy.parentId);
    return parents;
  }

  private getHomogeneousGroupsMap() {
    return this.homogeneousGroups.reduce((acc, group) => ({ ...acc, [group.id]: group }), {});
  }

  private getHierarchiesMap(hierarchies: HierarchyModel[]) {
    return hierarchies.reduce((acc, hierarchy) => ({ ...acc, [hierarchy.id]: hierarchy }), {});
  }

  private filterHierarchyGroups() {
    this.hierarchies.forEach((hierarchy) => {
      hierarchy.groups = hierarchy.groups.filter((group) => this.homogeneousGroupsMap[group.homogeneousGroupId] && this.hierarchiesMap[group.hierarchyId]);
    });

    this.homogeneousGroups.forEach((group) => {
      group.hierarchies = group.hierarchies.filter((hierarchy) => this.homogeneousGroupsMap[hierarchy.homogeneousGroupId] && this.hierarchiesMap[hierarchy.hierarchyId]);
    });
  }

  private setExamsMap() {
    this.exams.forEach((exam) => {
      this.examsMap[exam.id] = exam;

      exam.examRisks.forEach((examRisk) => {
        const riskId = examRisk.riskId;
        if (!this.risksDataExamsMap[riskId]) this.risksDataExamsMap[riskId] = [];
        this.risksDataExamsMap[riskId].push(
          new RiskDataExamModel({
            exam,
            requirement: examRisk.requirement,
          }),
        );
      });
    });
  }
}
