import { IDocumentSectionGroup } from '@/@v2/documents/libs/docx/builders/pgr/types/documet-section-groups.types';

export namespace ICreatorDocumentPreview {
  export type Params = {
    data: {
      sections: IDocumentSectionGroup[];
      variables: Record<string, string>;
    };
  };
}
