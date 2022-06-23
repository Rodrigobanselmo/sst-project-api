import { EnvironmentEntity } from './../../../../company/entities/environment.entity';
import { ISectionOptions } from 'docx';
import { RiskDocumentEntity } from 'src/modules/checklist/entities/riskDocument.entity';

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

export class DocumentBuildPGR {
  private version: string;
  private logoImagePath: string;
  private company: CompanyEntity;
  private workspace: WorkspaceEntity;
  private docSections: IDocumentPGRSectionGroups;
  private versions: RiskDocumentEntity[];
  private variables: IDocVariables;
  private environments: EnvironmentEntity[];

  constructor({
    version,
    logo,
    company,
    workspace,
    versions,
    environments,
  }: ICreatePGR) {
    this.version = version;
    this.logoImagePath = logo;
    this.company = company;
    this.workspace = workspace;
    this.docSections = docPGRSections;
    this.versions = versions;
    this.environments = environments;
    this.variables = this.getVariables();
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
    }).map;

    const sectionsMap = new SectionsMapClass({
      variables: this.variables,
      logoImagePath: this.logoImagePath,
      version: this.version,
      elementsMap,
    }).map;

    data.forEach((child) => {
      const section = sectionsMap[child.type](child);

      if (Array.isArray(section)) {
        return sections.push(...section);
      }

      return sections.push(section);
    });

    return sections;
  }
}
