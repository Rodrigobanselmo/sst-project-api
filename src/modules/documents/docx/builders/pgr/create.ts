import { RiskFactorGroupDataEntity } from './../../../../checklist/entities/riskGroupData.entity';
import { EnvironmentEntity } from './../../../../company/entities/environment.entity';
import { ISectionOptions } from 'docx';
import { RiskDocumentEntity } from '../../../../checklist/entities/riskDocument.entity';

import { CompanyEntity } from '../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../company/entities/workspace.entity';
import { VariablesPGREnum } from './enums/variables.enum';
import { companyVariables } from './functions/getVariables/company.variables';
import { ElementsMapClass } from './maps/elementTypeMap';
import { SectionsMapClass } from './maps/sectionTypeMap';
import { docPGRSections } from './mock';
import { ICreatePGR } from './types/pgr.types';
import {
  IAllSectionTypesPGR,
  IDocumentPGRSectionGroups,
  IDocVariables,
} from './types/section.types';
import {
  HierarchyMapData,
  IHomoGroupMap,
} from '../../converter/hierarchy.converter';

export class DocumentBuildPGR {
  private version: string;
  private logoImagePath: string;
  private company: CompanyEntity;
  private workspace: WorkspaceEntity;
  private docSections: IDocumentPGRSectionGroups;
  private versions: RiskDocumentEntity[];
  private variables: IDocVariables;
  private environments: EnvironmentEntity[];
  private document: RiskFactorGroupDataEntity;
  private homogeneousGroup: IHomoGroupMap;
  private hierarchy: Map<string, HierarchyMapData>;

  constructor({
    version,
    logo,
    company,
    workspace,
    versions,
    environments,
    document,
    homogeneousGroup,
    hierarchy,
  }: ICreatePGR) {
    this.version = version;
    this.logoImagePath = logo;
    this.company = company;
    this.workspace = workspace;
    this.docSections = docPGRSections;
    this.versions = versions;
    this.environments = environments;
    this.variables = this.getVariables();
    this.document = document;
    this.homogeneousGroup = homogeneousGroup;
    this.hierarchy = hierarchy;
  }

  public build() {
    const sections: ISectionOptions[] = this.docSections.sections
      .map((docSection) => {
        return this.convertToSections(docSection.data);
      })
      .reduce((acc, result) => {
        if (Array.isArray(result)) {
          return [...acc, ...result];
        }

        return [...acc, result];
      }, []);

    return sections;
  }

  private getVariables(): IDocVariables {
    return {
      [VariablesPGREnum.VERSION]: this.version,
      [VariablesPGREnum.DOC_VALIDITY]: this.versions[0].validity,
      [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]:
        this.document?.complementarySystems?.length > 0 ? 'true' : '',
      [VariablesPGREnum.DOCUMENT_COORDINATOR]:
        this.document?.coordinatorBy || '',
      ...companyVariables(this.company, this.workspace, this.workspace.address),
      ...this.docSections.variables,
    };
  }

  private convertToSections(data: IAllSectionTypesPGR[]): ISectionOptions[] {
    const sections: ISectionOptions[] = [];

    const elementsMap = new ElementsMapClass({
      versions: this.versions,
      variables: this.variables,
      professionals: this.company?.professionals ?? [],
      environments: this.environments ?? [],
      document: this.document,
      homogeneousGroup: this.homogeneousGroup,
      hierarchy: this.hierarchy,
    }).map;

    const sectionsMap = new SectionsMapClass({
      variables: this.variables,
      logoImagePath: this.logoImagePath,
      version: this.version,
      elementsMap,
    }).map;

    data.forEach((child) => {
      if ('removeWithSomeEmptyVars' in child) {
        const isEmpty = child.removeWithSomeEmptyVars.some(
          (variable) => !this.variables[variable],
        );
        if (isEmpty) {
          return null;
        }
      }

      if ('removeWithAllEmptyVars' in child) {
        const isEmpty = child.removeWithAllEmptyVars.every(
          (variable) => !this.variables[variable],
        );
        if (isEmpty) {
          return null;
        }
      }

      if ('removeWithAllValidVars' in child) {
        const isNotEmpty = child.removeWithAllValidVars.every(
          (variable) => this.variables[variable],
        );
        if (isNotEmpty) {
          return null;
        }
      }

      if ('addWithAllVars' in child) {
        const isNotEmpty = child.addWithAllVars.every(
          (variable) => this.variables[variable],
        );
        if (!isNotEmpty) {
          return null;
        }
      }

      const section = sectionsMap[child.type](child);

      if (Array.isArray(section)) {
        return sections.push(...section);
      }

      return sections.push(section);
    });

    return sections;
  }
}
