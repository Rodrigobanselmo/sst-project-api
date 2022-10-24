import { Paragraph, Table } from 'docx';

import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import {
  ISectionChildrenType,
  PGRSectionChildrenTypeEnum,
} from '../../../builders/pgr/types/elements.types';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { AttachmentEntity } from '../../../../../sst/entities/attachment.entity';
import { attachmentsConverter } from './attachments.converter';

export const attachmentsIterable = (
  attachments: AttachmentEntity[],
  convertToDocx: (
    data: ISectionChildrenType[],
    variables?: IDocVariables,
  ) => (Paragraph | Table)[],
) => {
  const attachmentsVarArray = attachmentsConverter(attachments);
  const iterableSections = attachmentsVarArray
    .map((variables, index) => {
      return convertToDocx(
        [
          {
            type: PGRSectionChildrenTypeEnum.BULLET,
            text: `<link>??${VariablesPGREnum.ATTACHMENT_LINK}??|ANEXO 0${
              index + 1
            } – ??${VariablesPGREnum.ATTACHMENT_NAME}??<link>`,
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
