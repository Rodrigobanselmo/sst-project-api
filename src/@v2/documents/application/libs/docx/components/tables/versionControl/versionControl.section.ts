import { PageOrientation } from 'docx';

import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { versionControlTable } from './versionControl.table';

export const versionControlTableSection = (riskDocumentEntity: RiskDocumentEntity[]) => {
  const table = versionControlTable(riskDocumentEntity);

  const section = {
    children: [table],
    properties: {
      page: {
        margin: { left: 500, right: 500, top: 500, bottom: 500 },
        size: { orientation: PageOrientation.LANDSCAPE },
      },
    },
  };

  return section;
};
