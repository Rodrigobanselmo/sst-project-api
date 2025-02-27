import { ISectionOptions } from 'docx';

import { IDocumentSectionGroup, IDocVariables } from '@/@v2/documents/libs/docx/builders/pgr/types/documet-section-groups.types';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { IAllDocumentSectionType } from '../../../../domain/types/section.types';
import { VariablesPGREnum } from './enums/variables.enum';
import { booleanVariables } from './functions/getVariables/boolean.variables';
import { companyVariables } from './functions/getVariables/company.variables';
import { ElementsMapClass } from './maps/elementTypeMap';
import { SectionsMapClass } from './maps/sectionTypeMap';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';

interface IDocumentBuildPGR {
  data: DocumentPGRModel;
  attachments: AttachmentModel[];
  variables: Record<string, string>;
  version: string;
  sections: IDocumentSectionGroup[];
}

export class DocumentBuildPGR {
  private data: DocumentPGRModel;
  private variables: IDocVariables;
  private attachments: AttachmentModel[];
  private version: string;
  private sections: IDocumentSectionGroup[];

  constructor({ data, version, attachments, sections, variables }: IDocumentBuildPGR) {
    this.data = data;
    this.version = version;
    this.attachments = attachments;
    this.sections = sections;
    this.variables = this.getVariables(variables);
  }

  public async build() {
    const sections: ISectionOptions[] = (
      await Promise.all(
        this.sections.map(async (docSection) => {
          return this.convertToSections(docSection.data);
        }),
      )
    ).reduce((acc, result) => {
      if (Array.isArray(result)) {
        return [...acc, ...result];
      }

      return [...acc, result];
    }, []);

    return sections;
  }

  private getVariables(variables: IDocumentBuildPGR['variables']): IDocVariables {
    return {
      [VariablesPGREnum.VERSION]: this.version,
      [VariablesPGREnum.DOC_VALIDITY]: this.data.documentBase.validUntil,
      [VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]: this.data?.documentBase.data.complementarySystems.length > 0 ? 'true' : '',
      [VariablesPGREnum.DOCUMENT_COORDINATOR]: this.data.documentBase.coordinatorBy || '',
      [VariablesPGREnum.DOCUMENT_TITLE]: 'Criar variavel local "TITULO_DO_DOCUMENTO"',
      ...companyVariables({
        employeeCount: this.data.numOfEmployee,
        company: this.data.documentBase.company,
        workspace: this.data.documentBase.workspace,
      }),
      ...booleanVariables(this.data),
      ...variables,
    };
  }

  private async convertToSections(data: IAllDocumentSectionType[]): Promise<ISectionOptions[]> {
    const sections: ISectionOptions[] = [];

    const elementsMap = new ElementsMapClass({
      data: this.data,
      variables: this.variables,
      attachments: this.attachments,
    }).map;

    const sectionsMap = new SectionsMapClass({
      data: this.data,
      variables: this.variables,
      elementsMap,
      version: this.version,
    }).map;

    await Promise.all(
      data.map(async (child) => {
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

        const section = await sectionsMap[child.type](child);

        if (Array.isArray(section)) {
          return sections.push(...section);
        }

        return sections.push(section);
      }),
    );

    return sections;
  }
}
