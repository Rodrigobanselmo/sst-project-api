import { AlignmentType } from 'docx';

import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { borderNoneStyle } from '../../elements/body';
import { borderRightStyle } from '../../elements/header';
import { riskInventoryCompactContentFont } from '@/@v2/documents/libs/docx/components/tables/appr/risk-inventory-typography.constant';

export const dataConverter = (hierarchyData: HierarchyMapData) => {
  return [
    {
      text: hierarchyData.descRh,
      alignment: AlignmentType.CENTER,
      borders: borderRightStyle,
      ...riskInventoryCompactContentFont,
    },
    {
      text: hierarchyData.descReal,
      alignment: AlignmentType.CENTER,
      borders: borderNoneStyle,
      ...riskInventoryCompactContentFont,
    },
  ];
};
