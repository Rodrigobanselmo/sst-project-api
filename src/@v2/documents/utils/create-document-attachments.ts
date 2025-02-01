import { arrayChunks } from '@/@v2/shared/utils/helpers/array-chunks';
import { IDocumentAttachment } from '../factories/document/types/document-factory.types';
import { ISectionOptions } from 'docx';
import { v4 } from 'uuid';
import { AttachmentModel } from '../domain/models/attachment.model';

type IParams = {
  name: string;
  typeName: string;
  sections: ISectionOptions[];
  documentVersionId: string;
  companyId: string;
};

export function createDocumentAttachments(params: IParams): IDocumentAttachment[] {
  const sectionChunks = arrayChunks(params.sections, 400);
  const hasManyChunks = sectionChunks.length > 1;

  const attachmentsChunks = sectionChunks.map((section, index) => {
    const id = v4();
    return {
      id: id,
      section: section,
      model: new AttachmentModel({
        name: `${params.name}${hasManyChunks ? ` - Parte ${index + 1}` : ''}`,
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${params.documentVersionId}&ref2=${id}&ref3=${params.companyId}`,
        type: params.typeName,
      }),
    };
  });

  return attachmentsChunks;
}
