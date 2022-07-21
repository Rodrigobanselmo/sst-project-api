import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';
import { AttachmentEntity } from './../../../../../checklist/entities/attachment.entity';

export const attachmentsConverter = (
  attachments: AttachmentEntity[],
): IDocVariables[] => {
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
