import { ISectionOptions } from 'docx';

import { IDocVariables } from '@/@v2/documents/application/libs/docx/builders/pgr/types/IDocumentPGRSectionGroups';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { IAllDocumentSectionType, } from '../../../../../domain/types/section.types';
import { VariablesPGREnum } from './enums/variables.enum';
import { booleanVariables } from './functions/getVariables/boolean.variables';
import { companyVariables } from './functions/getVariables/company.variables';
import { ElementsMapClass } from './maps/elementTypeMap';
import { SectionsMapClass } from './maps/sectionTypeMap';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';

interface IDocumentBuildPGR {
  data: DocumentPGRModel
  attachments: AttachmentModel[];
  version: string
}

export class DocumentBuildPGR {
  private data: DocumentPGRModel;
  private variables: IDocVariables;
  private attachments: AttachmentModel[];
  private version: string;

  constructor({ data, version, attachments }: IDocumentBuildPGR) {
    this.data = data;
    this.version = version;
    this.attachments = attachments;
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
      ...booleanVariables({ ...this.data, documentType: 'isPGR' }),
      ...docVariables,
    };
  }

  private convertToSections(data: IAllDocumentSectionType[]): ISectionOptions[] {
    const sections: ISectionOptions[] = [];

    const elementsMap = new ElementsMapClass({
      data: this.data,
      variables: this.variables,
      attachments: this.attachments,
      imagesMap: this.imagesMap,
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
        const isEmpty = child.removeWithSomeEmptyVars?.some((variable) => !this.variables[variable]);
        if (isEmpty) {
          return null;
        }
      }

      if ('removeWithAllEmptyVars' in child) {
        const isEmpty = child.removeWithAllEmptyVars?.every((variable) => !this.variables[variable]);
        if (isEmpty) {
          return null;
        }
      }

      if ('removeWithAllValidVars' in child) {
        const isNotEmpty = child.removeWithAllValidVars?.every((variable) => this.variables[variable]);
        if (isNotEmpty) {
          return null;
        }
      }

      if ('addWithAllVars' in child) {
        const isNotEmpty = child.addWithAllVars?.every((variable) => this.variables[variable]);
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
