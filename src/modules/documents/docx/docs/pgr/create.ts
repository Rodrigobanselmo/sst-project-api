import { ISectionOptions } from 'docx';

import { sectionTypeMap } from './constants/sectionTypeMap';
import { docPGRSections } from './mock';
import { ICreatePGR } from './types/pgr.types';
import {
  IAllSectionTypesPGR,
  IDocumentPGRSectionGroups,
  IDocVariables,
} from './types/section.types';

export class CreatePgr {
  private version: string;
  private logo: string;
  private docSections: IDocumentPGRSectionGroups;

  constructor({ version, logo }: ICreatePGR) {
    this.version = version;
    this.logo = logo;
    this.docSections = docPGRSections;
  }

  public create() {
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

  private getVariables(): IDocVariables[] {
    return [
      { placeholder: 'VERSAO_E_DATA_DO_DOCUMENTO', value: this.version },
      ...this.docSections.variables,
    ];
  }

  private convertToSections(data: IAllSectionTypesPGR[]): ISectionOptions[] {
    const sections: ISectionOptions[] = [];
    const sectionProps = {
      logoPath: this.logo,
      version: this.version,
    };

    data.forEach((child) => {
      const section = sectionTypeMap(sectionProps)[child.type](
        child,
        this.getVariables(),
      );

      if (Array.isArray(section)) {
        return sections.push(...section);
      }

      return sections.push(section);
    });

    return sections;
  }
}
