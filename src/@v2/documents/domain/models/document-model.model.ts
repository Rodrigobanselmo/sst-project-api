import { parseModelData } from '../../libs/docx/builders/pgr/functions/parseModelData';
import { IDocumentSectionGroup, IDocumentSectionGroups } from '../../libs/docx/builders/pgr/types/documet-section-groups.types';
import { convertModelDataBuffer } from '../functions/conver-model-data-buffer';
import { IDocumentModelData } from '../types/document-mode-data.types';
import { IImage } from '../types/elements.types';

export type IDocumentModelModel =
  | {
      data: Buffer;
    }
  | {
      sections: IDocumentSectionGroup[];
      variables: Record<string, string>;
    };

export class DocumentModelModel {
  #data: IDocumentModelData | null = null;
  sections: IDocumentSectionGroup[] = [];
  variables: Record<string, string> = {};

  constructor(params: IDocumentModelModel) {
    if ('sections' in params) {
      this.sections = params.sections;
      this.variables = params.variables;
      return;
    }

    this.#data = convertModelDataBuffer(params.data);

    const data = this.data();
    this.sections = data.sections;
    this.variables = data.variables;
  }

  get images() {
    const imagesMap: Record<string, IImage> = {};

    this.#data?.sections.forEach((section) => {
      if (!section.children) return;
      Object.values(section.children).forEach((data) => {
        data.forEach((child) => {
          if (child.type === 'IMAGE' && child.url) {
            imagesMap[child.url] = child;
          }
        });
      });
    }, []);

    return Object.values(imagesMap);
  }

  private data(): IDocumentSectionGroups {
    const modelData = this.#data;
    if (!modelData)
      return {
        sections: [],
        variables: {},
      };

    return parseModelData(modelData);
  }
}
