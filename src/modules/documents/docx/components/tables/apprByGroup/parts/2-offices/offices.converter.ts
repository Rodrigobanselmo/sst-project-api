import { AlignmentType } from 'docx';

import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { borderNoneStyle } from '../../elements/body';
import { originRiskMap } from './../../../../../../../../shared/constants/maps/origin-risk';
import { HierarchyEntity } from './../../../../../../../company/entities/hierarchy.entity';

export const dataConverter = (hierarchyData: HierarchyMapData & { hierarchies: HierarchyEntity[] }) => {
  return [
    {
      text: (hierarchyData.hierarchies || []).map((h) => `${h.name} (${originRiskMap[h.type].name})`).join(', '),
      alignment: AlignmentType.CENTER,
      borders: borderNoneStyle,
    },
  ];
};
