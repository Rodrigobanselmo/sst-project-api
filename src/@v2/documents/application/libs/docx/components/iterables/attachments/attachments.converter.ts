import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/IDocumentPGRSectionGroups';

export const attachmentsConverter = (attachments: AttachmentModel[]): IDocVariables[] => {
  const attachmentsData: IDocVariables[] = [];
  attachments.forEach((attachment) => {
    if (attachment?.url)
      attachmentsData.push({
        [VariablesPGREnum.ATTACHMENT_LINK]: attachment.url,
        [VariablesPGREnum.ATTACHMENT_NAME]: attachment.name,
      });
  });

  return attachmentsData;
};
