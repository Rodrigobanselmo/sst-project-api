import { AlignmentType } from 'docx';

import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { borderNoneStyle } from '../../elements/body';
import { borderRightStyle } from '../../elements/header';
import { EPIModel } from '@/@v2/documents/domain/models/epis.model';

export const dataConverter = (epis: EPIModel[], isHideCA: boolean) => {
  return [
    {
      text: epis.map((epi) => (isHideCA ? epi.equipment : epi.name)).join(', '),
      alignment: AlignmentType.CENTER,
      borders: borderNoneStyle,
    },
  ];
};
