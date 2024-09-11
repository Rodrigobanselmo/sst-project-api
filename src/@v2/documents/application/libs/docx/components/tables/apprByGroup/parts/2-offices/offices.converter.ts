import { AlignmentType } from 'docx';

import { HierarchyMapData, IHierarchyDataConverter } from '../../../../../converter/hierarchy.converter';
import { borderNoneStyle } from '../../elements/body';
import { originRiskMap } from '../../../../../constants/origin-risk';

export const dataConverter = (hierarchyData: HierarchyMapData & { hierarchies: IHierarchyDataConverter[] }) => {
  return [
    {
      text: (hierarchyData.hierarchies || []).map((h) => `${h.name} (${originRiskMap[h.type].name})`).join(', '),
      alignment: AlignmentType.CENTER,
      borders: borderNoneStyle,
    },
  ];
};
