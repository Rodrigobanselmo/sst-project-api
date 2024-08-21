import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { ISectionChildrenType } from '../../../../../../domain/types/elements.types';
import { DocumentSectionChildrenTypeEnum } from '@/@v2/documents/domain/types/DocumentSectionChildrenTypeEnum';
import { IDocVariables } from '../../../../../../domain/types/section.types';
import { AttachmentModel } from '../../../../../sst/entities/attachment.entity';
import { attachmentsConverter } from './attachments.converter';

export const attachmentsIterable = (
  attachments: AttachmentModel[],
  convertToDocx: (data: ISectionChildrenType[], variables?: IDocVariables) => (Paragraph | Table)[],
) => {
  const attachmentsVarArray = attachmentsConverter(attachments);
  const iterableSections = attachmentsVarArray
    .map((variables, index) => {
      return convertToDocx(
        [
          {
            type: DocumentSectionChildrenTypeEnum.BULLET,
            text: `<link>??${VariablesPGREnum.ATTACHMENT_LINK}??|ANEXO 0${index + 1} – ??${VariablesPGREnum.ATTACHMENT_NAME}??<link>`,
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
