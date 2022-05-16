import { AlignmentType } from 'docx';

import { MapData } from '../../converter/hierarchy.converter';
import { borderNoneStyle } from '../../elements/body';
import { borderRightStyle } from '../../elements/header';

export const dataConverter = (hierarchyData: MapData) => {
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
