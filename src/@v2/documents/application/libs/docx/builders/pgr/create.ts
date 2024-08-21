import { ExamEntity, IExamOrigins, IRiskExamMap } from './../../../../sst/entities/exam.entity';
import { IImagesMap } from './../../../factories/document/types/IDocumentFactory.types';
import { DocumentDataPGRDto } from './../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../sst/entities/documentData.entity';
import { DocumentCoverEntity } from './../../../../company/entities/document-cover.entity';
import { AttachmentModel } from '../../../../sst/entities/attachment.entity';
import { CharacterizationEntity } from './../../../../company/entities/characterization.entity';
import { RiskFactorGroupDataEntity } from '../../../../sst/entities/riskGroupData.entity';
import { ISectionOptions } from 'docx';
import { RiskDocumentEntity } from '../../../../sst/entities/riskDocument.entity';

import { CompanyModel } from '../../../../company/entities/company.entity';
import { WorkspaceEntity } from '../../../../company/entities/workspace.entity';
import { VariablesPGREnum } from './enums/variables.enum';
import { companyVariables } from './functions/getVariables/company.variables';
import { ElementsMapClass } from './maps/elementTypeMap';
import { SectionsMapClass } from './maps/sectionTypeMap';
import { docPGRSections } from './mock';
import { ICreatePGR } from './types/pgr.types';
import { IAllDocumentSectionType, } from '../../../../../domain/types/section.types';
import { IDocumentSectionGroups, IDocVariables } from '@/@v2/documents/application/libs/docx/builders/pgr/types/IDocumentPGRSectionGroups';
import { HierarchyMapData, IHierarchyMap, IHomoGroupMap, IRiskMap } from '../../converter/hierarchy.converter';
import { booleanVariables } from './functions/getVariables/boolean.variables';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';

interface IDocumentBuildPGR {
  data: DocumentPGRModel
  version: string
}

export class DocumentBuildPGR {
  private data: DocumentPGRModel;
  private variables: IDocVariables;
  private version: string;

  constructor({ data, version }: IDocumentBuildPGR) {
    this.data = data;
    this.version = version;
    this.variables = this.getVariables();
  }

  public build() {
    const sections: ISectionOptions[] = this.data.model.sections
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
    const docVariables = this.data.model.variables;

    return {
      [VariablesPGREnum.VERSION]: this.version,
      [VariablesPGREnum.DOC_VALIDITY]: this.data.documentBase.validUntil,
      [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]: this.data?.documentBase.data.complementarySystems.length > 0 ? 'true' : '',
      [VariablesPGREnum.DOCUMENT_COORDINATOR]: this.data.documentBase.coordinatorBy || '',
      [VariablesPGREnum.DOCUMENT_TITLE]: 'Criar variavel local "TITULO_DO_DOCUMENTO"',
      ...companyVariables(this.data.documentBase.company, this.data.documentBase.workspace),
      ...booleanVariables(this.data),
      ...docVariables,
    };
  }

  private convertToSections(data: IAllDocumentSectionType[]): ISectionOptions[] {
    const sections: ISectionOptions[] = [];

    const elementsMap = new ElementsMapClass({
      versions: this.versions,
      variables: this.variables,
      professionals: [...(this.data?.professionals || [])],
      environments: this.environments ?? [],
      characterizations: this.characterizations ?? [],
      document: this.data,
      homogeneousGroup: this.homogeneousGroup,
      hierarchy: this.hierarchy,
      attachments: this.attachments,
      hierarchyTree: this.hierarchyTree,
      workspace: this.workspace,
      imagesMap: this.imagesMap,
      exams: this.exams,
      risksMap: this.risksMap,
      riskExamMap: this.riskExamMap,
    }).map;

    const sectionsMap = new SectionsMapClass({
      variables: this.variables,
      logoImagePath: this.logoImagePath,
      consultantLogoImagePath: this.consultantLogoImagePath,
      version: this.version,
      elementsMap,
      document: this.data,
      homogeneousGroup: this.homogeneousGroup,
      hierarchy: this.hierarchy,
      environments: this.environments ?? [],
      characterizations: this.characterizations ?? [],
      company: this.company,
      cover: this.cover,
      hierarchyTree: this.hierarchyTree,
      hierarchyHighLevelsData: this.hierarchyHighLevelsData,
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
