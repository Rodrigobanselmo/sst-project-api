import { DocumentDataPGRDto } from './../../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../../../sst/entities/documentData.entity';
import { PageOrientation } from 'docx';

import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { IHierarchyMap } from './../../../../converter/hierarchy.converter';
import { quantityNoiseTable } from './quantityNoise.table';

export const quantityNoiseTableSection = (riskGroupData: RiskFactorGroupDataEntity & DocumentDataEntity & DocumentDataPGRDto, hierarchyTree: IHierarchyMap) => {
  const table = quantityNoiseTable(riskGroupData, hierarchyTree);

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
