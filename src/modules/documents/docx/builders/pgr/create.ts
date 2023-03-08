import { DocumentDataPGRDto } from './../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../sst/entities/documentData.entity';
import { DocumentCoverEntity } from './../../../../company/entities/document-cover.entity';
import { AttachmentEntity } from '../../../../sst/entities/attachment.entity';
import { CharacterizationEntity } from './../../../../company/entities/characterization.entity';
import { RiskFactorGroupDataEntity } from '../../../../sst/entities/riskGroupData.entity';
import { ISectionOptions } from 'docx';
import { RiskDocumentEntity } from '../../../../sst/entities/riskDocument.entity';

import { CompanyEntity } from '../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../company/entities/workspace.entity';
import { VariablesPGREnum } from './enums/variables.enum';
import { companyVariables } from './functions/getVariables/company.variables';
import { ElementsMapClass } from './maps/elementTypeMap';
import { SectionsMapClass } from './maps/sectionTypeMap';
import { docPGRSections } from './mock';
import { ICreatePGR } from './types/pgr.types';
import { IAllDocumentSectionType, IDocumentPGRSectionGroups, IDocVariables } from './types/section.types';
import { HierarchyMapData, IHierarchyMap, IHomoGroupMap } from '../../converter/hierarchy.converter';
import { booleanVariables } from './functions/getVariables/boolean.variables';

export class DocumentBuildPGR {
  private version: string;
  private logoImagePath: string;
  private consultantLogoImagePath: string;
  private cover: DocumentCoverEntity;
  private company: CompanyEntity;
  private workspace: WorkspaceEntity;
  private docSections: IDocumentPGRSectionGroups;
  private versions: RiskDocumentEntity[];
  private variables: IDocVariables;
  private environments: CharacterizationEntity[];
  private document: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto;
  private homogeneousGroup: IHomoGroupMap;
  private hierarchy: Map<string, HierarchyMapData>;
  private characterizations: CharacterizationEntity[];
  private attachments: AttachmentEntity[];
  private hierarchyTree: IHierarchyMap;

  constructor({
    version,
    logo,
    consultantLogo,
    company,
    workspace,
    versions,
    environments,
    document,
    homogeneousGroup,
    hierarchy,
    characterizations,
    attachments,
    hierarchyTree,
    cover,
    docSections,
  }: ICreatePGR) {
    this.version = version;
    this.logoImagePath = logo;
    this.cover = cover;
    this.consultantLogoImagePath = consultantLogo;
    this.company = company;
    this.workspace = workspace;
    this.docSections = docSections || docPGRSections;
    this.versions = versions;
    this.environments = environments;
    this.document = document;
    this.homogeneousGroup = homogeneousGroup;
    this.hierarchy = hierarchy;
    this.characterizations = characterizations;
    this.attachments = attachments;
    this.hierarchyTree = hierarchyTree;
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
      [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]: this.document?.complementarySystems?.length > 0 ? 'true' : '',
      [VariablesPGREnum.DOCUMENT_COORDINATOR]: this.document?.coordinatorBy || '',
      ...companyVariables(this.company, this.workspace, this.workspace.address),
      ...booleanVariables(this.company, this.workspace, this.hierarchy, this.document),
      ...this.docSections.variables,
    };
  }

  private convertToSections(data: IAllDocumentSectionType[]): ISectionOptions[] {
    const sections: ISectionOptions[] = [];

    const elementsMap = new ElementsMapClass({
      versions: this.versions,
      variables: this.variables,
      professionals: [...(this.document?.professionals || [])],
      environments: this.environments ?? [],
      characterizations: this.characterizations ?? [],
      document: this.document,
      homogeneousGroup: this.homogeneousGroup,
      hierarchy: this.hierarchy,
      attachments: this.attachments,
      hierarchyTree: this.hierarchyTree,
      workspace: this.workspace,
    }).map;

    const sectionsMap = new SectionsMapClass({
      variables: this.variables,
      logoImagePath: this.logoImagePath,
      consultantLogoImagePath: this.consultantLogoImagePath,
      version: this.version,
      elementsMap,
      document: this.document,
      homogeneousGroup: this.homogeneousGroup,
      hierarchy: this.hierarchy,
      environments: this.environments ?? [],
      characterizations: this.characterizations ?? [],
      company: this.company,
      cover: this.cover,
    }).map;

    data.forEach((child) => {
      if ('removeWithSomeEmptyVars' in child) {
        const isEmpty = child.removeWithSomeEmptyVars.some((variable) => !this.variables[variable]);
        if (isEmpty) {
          return null;
        }
      }

      if ('removeWithAllEmptyVars' in child) {
        const isEmpty = child.removeWithAllEmptyVars.every((variable) => !this.variables[variable]);
        if (isEmpty) {
          return null;
        }
      }

      if ('removeWithAllValidVars' in child) {
        const isNotEmpty = child.removeWithAllValidVars.every((variable) => this.variables[variable]);
        if (isNotEmpty) {
          return null;
        }
      }

      if ('addWithAllVars' in child) {
        const isNotEmpty = child.addWithAllVars.every((variable) => this.variables[variable]);
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
