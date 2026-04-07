import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../domain/types/elements.types';
import { DocumentChildrenTypeEnum as DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/enums/document-children-type.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';
import { attachmentsConverter } from './attachments.converter';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';

export const attachmentsIterable = (attachments: AttachmentModel[], convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[]) => {
  const attachmentsVarArray = attachmentsConverter(attachments);
  const iterableSections = attachmentsVarArray
    .map((variables, index) => {
      return convertToDocx(
        [
          {
            type: DocumentSectionChildrenTypeEnum.BULLET,
            text: `ANEXO 0${index + 1} – ??${VariablesPGREnum.ATTACHMENT_NAME}??`,
          },
        ],
        variables,
      );
    })
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, []);

  return iterableSections;
};
