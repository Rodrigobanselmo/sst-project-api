import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/documet-section-groups.types';

export const attachmentsConverter = (attachments: AttachmentModel[]): IDocVariables[] => {
  const attachmentsData: IDocVariables[] = [];
  attachments.forEach((attachment) => {
    if (attachment?.link)
      attachmentsData.push({
        [VariablesPGREnum.ATTACHMENT_LINK]: attachment.link,
        [VariablesPGREnum.ATTACHMENT_NAME]: attachment.name,
      });
  });

  return attachmentsData;
};
