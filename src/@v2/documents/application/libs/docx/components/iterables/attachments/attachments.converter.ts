import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../../../../domain/types/section.types';
import { AttachmentModel } from '../../../../../sst/entities/attachment.entity';

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
