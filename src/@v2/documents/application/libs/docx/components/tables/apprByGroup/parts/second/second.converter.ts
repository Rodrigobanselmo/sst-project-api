import { AlignmentType } from 'docx';

import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { borderNoneStyle } from '../../elements/body';
import { borderRightStyle } from '../../elements/header';

export const dataConverter = (hierarchyData: HierarchyMapData) => {
  return [
    {
      text: hierarchyData.descRh,
      alignment: AlignmentType.CENTER,
      borders: borderRightStyle,
    },
    {
      text: hierarchyData.descReal,
      alignment: AlignmentType.CENTER,
      borders: borderNoneStyle,
    },
  ];
};
